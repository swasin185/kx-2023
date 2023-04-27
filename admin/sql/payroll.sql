set foreign_key_checks = 0;
drop table if exists deduction;
create table deduction (
    costPercent    decimal(4,2) comment 'หักค่าใช้จ่าย %',
    costLimit      mediumint unsigned comment 'หักค่าใช้จ่ายไม่เกิน',
    deductSelf     mediumint unsigned comment 'ค่าลดหย่อนส่วนตัว',
    deductSpouse   mediumint unsigned comment 'ค่าลดหย่อนคู่สมรส',
    deductChild    mediumint unsigned comment 'ค่าลดหย่อนบุตรธิดา',
    deductChildEdu mediumint unsigned comment 'ค่าลดหย่อนบุตรธิดา กำลังศึกษา'
) comment = 'ประเภทเงินหักลดหย่อน ของกรมสรรพากร';
insert into deduction values (50.0, 100000, 60000, 60000, 30000, 30000);

drop table if exists timetype;
create table timetype (
    timeCode       smallint unsigned auto_increment,
    descript       varchar(40) comment "คำอธิบายวิธีการคิดเวลางาน",
    workStart      varchar(8) default "08:00:00" comment "hh:mm:ss",
    lunchBreak     varchar(8) default "12:00:00" comment "hh:mm:ss",
    workFinish     varchar(8) default "17:00:00" comment "hh:mm:ss",
    shift1Start    varchar(8) default "06:00:00" comment "hh:mm:ss",
    shift1Finish   varchar(8) default "14:00:00" comment "hh:mm:ss",
    shift2Start    varchar(8) default "14:00:00" comment "hh:mm:ss",
    shift2Finish   varchar(8) default "22:00:00" comment "hh:mm:ss",
    shift3Start    varchar(8) default "22:00:00" comment "hh:mm:ss",
    shift3Finish   varchar(8) default "06:00:00" comment "hh:mm:ss",
    otRate1        decimal(2,1) default 1.5 comment "วันทำงาน",
    otRate2        decimal(2,1) default 2.0 comment "วันหยุด",
    otRate3        decimal(2,1) default 3.0 comment "หลังเที่ยงคืน",
    allowance1     decimal(9,2) default 0.0 comment "เบี้ยเลี้ยง 1",
    allowance2     decimal(9,2) default 0.0 comment "เบี้ยเลี้ยง 2",
    primary key (timeCode)
) comment = "กำหนดค่าวิธีคิดเวลาทำงาน เบี้ยเลี้ยง OT";
insert into timetype (descript) value ("เวลาทำงานปกติ มี OT เบี้ยเลี้ยง");

drop table if exists employee;
create table employee (
    comCode        varchar(2) comment "รหัสบริษัท",
    empCode        smallint unsigned comment "รหัสพนักงาน",
    taxid          varchar(17) comment "เลขประจำตัวผู้เสียภาษี เลขบัตรประชาชน",
    prefix         varchar(16) comment "คำนำหน้าชื่อ",
    name           varchar(16) comment "ชื่อจริง",
    surName        varchar(20) comment "นามสกุล",
    nickName       varchar(20) comment "ชื่อเล่น",
    birthDate      date comment "วันเดือนปีเกิด",
    department     varchar(20) comment "แผนก ฝ่าย",
    timeCode       smallint unsigned default 0 comment "timetype code",
    beginDate      date comment "วันที่เริ่มทำงาน",
    endDate        date comment "วันที่สิ้นสุดทำงาน",
    empType        varchar(10) comment "ประเภทพนักงาน ประจำ/ชั่วคราว/ฝึกงาน",
    bankAccount    varchar(20) comment "เลขที่บัญชีธนาคาร",
    address        varchar(100) comment "ที่อยู่",
    phone          varchar(20) comment "เบอร์โทรศัพท์",
    childAll       tinyint unsigned comment "จำนวนบุตรทั้งหมด",
    childEdu       tinyint unsigned comment "จำนวนบุตรกำลังศึกษา",
    isSpouse       boolean default false comment "ลดหย่อนคู่สมรสหรือไม่",
    isChildShare   boolean default false comment "ลดหย่อนบุตรแบ่งครึ่งหรือไม่",
    isExcSocialIns boolean default false comment "ยกเว้นประกันสังคมหรือไม่",
    deductInsure   decimal(9,2) default 0 comment "ลดหย่อนประกันชีวิต",
    deductHome     decimal(9,2) default 0 comment "ลดหย่อนผ่อนที่อยู่อาศัย",
    deductElse     decimal(9,2) default 0 comment "ลดหย่อนอื่นๆ",
    scanCode       varchar(5) comment "รหัสสแกนลายนิ้วมือ" ,
    unique (comCode, scanCode),
    foreign key (comCode) references company(comCode),
    foreign key (timeCode) references timetype(timeCode),
    primary key (comCode, empCode)
) comment = "พนักงาน ลูกจ้าง";

drop table if exists incometype;
create table incometype (
    inCode         varchar(2) comment "รหัสประเภทเงิน",
    inName         varchar(30) comment "ชื่อประเภทเงิน",
    inType         tinyint default 1 comment "เป็นเงินได้ (1) หรือ เงินหัก (-1)",
    isTax          boolean default true comment "คิดภาษีประจำปีหรือไม่",
    isReset        boolean default true comment "reset เป็นศูนย์ ในเดือนต่อไป",
    initLimit      decimal(9,2) default 0 comment "ค่าเริ่มต้นสำหรับทุกๆคนไม่เกิน",
    initPercent    decimal(4,2) default 0 comment "อัตราค่าเริ่มต้นสำหรับทุกๆคน",
    primary key (inCode)
) comment = "ประเภทเงินได้ เงินหัก";

drop table if exists taxrate;
create table taxrate (
	total          mediumint unsigned comment "เงินได้ไม่เกิน",
	rate           decimal(4,2) comment "อัตราภาษีเปอร์เซ็น",
	primary key (total)
) comment = "อัตราการคำนวณภาษี";
insert into taxrate values 
( 150000,  0.0),
( 300000,  5.0),
( 500000, 10.0),
( 750000, 15.0),
(1000000, 20.0),
(2000000, 25.0),
(5000000, 30.0),
(9999999, 35.0);

drop table if exists salary;
create table salary (
    comCode       varchar(2),
    empCode       smallint unsigned,
    inCode        varchar(2),
    value         decimal(9,2) comment "จำนวนเงิน",
    duration      tinyint unsigned comment "จำนวนงวดที่จ่าย",
    foreign key (comCode, empCode) references employee(comCode, empCode),
    foreign key (inCode) references incometype(inCode),
    primary key (comCode, empCode, inCode)
) comment = "ตั้งค่าเงินเดือน";

drop table if exists payroll;
create table payroll (
    yr            smallint unsigned comment "ปี",
    mo            tinyint unsigned comment "เดือน",
    comCode       varchar(2),
    empCode       smallint unsigned,
    inCode        varchar(2),
    value         decimal(9,2) comment "จำนวนเงิน",
    foreign key (comCode, empCode) references employee(comCode, empCode),
    foreign key (inCode) references incometype(inCode),
    primary key (yr, mo, comCode, empCode, inCode)
) comment = "รายการจ่ายเงินเดือนในแต่ละเดือน";

drop table if exists holiday;
create table holiday (
    comCode       varchar(2),
    dateValue     date comment "วันเดือนปีวันหยุด",
    dateName      varchar(40) comment "ชื่อวันหยุด",
    primary key (comCode, dateValue)
) comment = "รายการวันหยุดประจำปี";

drop table if exists timecard;
create table timecard (
    scanCode      varchar(5),
    dateTxt       varchar(10) comment "วันที่ text",
    timeTxt       varchar(8) comment "เวลา text",
    primary key (scanCode, dateTxt, timeTxt)
) comment = "รายการลงเวลา";

drop table if exists attendance;
create table attendance (
    comCode       varchar(2),
    empCode       smallint unsigned,
    dateTxt       varchar(10) comment "วันเดือนปีทำงาน",
    inTime1       varchar(8) comment "เวลาเข้า เช้า",
    outTime1      varchar(8) comment "เวลาออก เช้า",
    inTime2       varchar(8) comment "เวลาเข้า บ่าย",
    outTime2      varchar(8) comment "เวลาออก บ่าย",
    inTime3       varchar(8) comment "เวลาเข้า ค่ำ",
    outTime3      varchar(8) comment "เวลาออก ค่ำ",
    workMinute    smallint unsigned default 0 comment "จำนวนนาทีทำงาน",
    otMinute      smallint unsigned default 0 comment "จำนวนนาทีล่วงเวลา",
    foreign key (comCode, empCode) references employee(comCode, empCode),
    primary key (comCode, empCode, dateTxt)
) comment = "วันที่มาทำงาน เวลาเข้าออกงาน";

set foreign_key_checks = 1;