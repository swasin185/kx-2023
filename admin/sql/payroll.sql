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
    beginDate      date comment "วันที่เริ่มทำงาน",
    endDate        date comment "วันที่สิ้นสุดทำงาน",
    empType        varchar(10) comment "ประเภทพนักงาน ประจำ/ชั่วคราว/ฝึกงาน",
    bankAccount    varchar(20) comment "เลขที่บัญชีธนาคาร",
    address        varchar(100) comment "ที่อยู่",
    phone          varchar(20) comment "เบอร์โทรศัพท์",
    child          tinyint unsigned comment "จำนวนบุตรทั้งหมด",
    childEdu       tinyint unsigned comment "จำนวนบุตรกำลังศึกษา",
    isSpouse       boolean default false comment "ลดหย่อนคู่สมรสหรือไม่",
    isChildShare   boolean default false comment "ลดหย่อนบุตรแบ่งครึ่งหรือไม่",
    isExcSocialIns boolean default false comment "ยกเว้นประกันสังคมหรือไม่",
    deductInsure   decimal(9,2) default 0 comment "ลดหย่อนประกันชีวิต",
    deductHome     decimal(9,2) default 0 comment "ลดหย่อนผ่อนที่อยู่อาศัย",
    deductElse     decimal(9,2) default 0 comment "ลดหย่อนอื่นๆ",
    foreign key (comCode) references company(comCode),
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
insert into taxrate values ( 150000,  0.0);
insert into taxrate values ( 300000,  5.0);
insert into taxrate values ( 500000, 10.0);
insert into taxrate values ( 750000, 15.0);
insert into taxrate values (1000000, 20.0);
insert into taxrate values (2000000, 25.0);
insert into taxrate values (5000000, 30.0);
insert into taxrate values (9999999, 35.0);

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

set foreign_key_checks = 1;