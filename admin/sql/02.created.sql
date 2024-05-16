set foreign_key_checks = 0;

drop table if exists kxuser;
create table kxuser (
  user          varchar(16),
  name          varchar(40) comment "ชื่อ นามสกุล",
  descript      varchar(60) comment "คำอธิบายหน้าที่",
  level         tinyint not null default 0 comment "ระดับการใช้งานทั่วไป",
  role          varchar(16) comment "หน้าที่",
  passwd        varchar(32) comment "รหัสผ่านเข้าใช้งาน",
  passwdTime    timestamp comment "วันที่ตั้งรหัสผ่าน",
  passwd2       varchar(32) comment "รหัสผ่านซุปเปอร์ไวเซอร์",
  passwd2Time   timestamp comment "วันที่ตั้งรหัสผ่าน 2",
  created       date default curdate() comment "วันที่สร้างผู้ใช้",
  stoped        date comment "วันที่สิ้นสุดการทำงาน",
  primary key (user)
) comment = 'ชื่อผู้ใช้งานระบบ';
insert into kxuser(user, name, descript, level)
values ('admin', 'แอดมินไงจะใครละ', 'ผู้ดูแลระบบ', 9);
insert into kxuser(user, name, descript, level)
values ('tom', 'ทอม', 'ทดสอบผู้ใช้ทั่วไป', 1);

drop table if exists kxpermission;
create table kxpermission (
  user          varchar(16),
  program       varchar(16),
  level         tinyint not null default 0 comment 'ระดับการใช้งาน 0 - 9',
  used          integer unsigned not null default 0 comment 'จำนวนครั้งที่ใช้',
  foreign key (user) references kxuser(user) on delete cascade,
  primary key (user, program)
) comment = 'สิทธิการใช้โปรแกรม';
insert into kxpermission values ('tom','TestPanel',1,0);
insert into kxpermission values ('tom','TestReport',1,0);
insert into kxpermission values ('tom','User',1,0);

drop table if exists company;
create table company (
  comCode       varchar(2),
  comName       varchar(64) not null comment 'บริษัท ชื่อ',
  taxid         varchar(13) comment 'เลขประจำตัวผู้เสียภาษี',
  address       varchar(100) comment 'ที่อยู่',
  phone         varchar(100) comment 'เบอร์โทรศัพท์ FAX มือถือ',
  email1        varchar(30) comment 'email 1',
  email2        varchar(30) comment 'email 2',
  email3        varchar(30) comment 'email 3',
  yr             smallint unsigned default year(curdate()) comment "ปีปัจจุบันที่กำลังทำงาน",
  mo             tinyint unsigned default month(curdate()) comment "เดือนปัจจุบันที่กำลังทำงาน",
  primary key (comCode)
) comment = 'บริษัท-ข้อมูลของแต่ละบริษัท';
-- insert into company(comCode, comName) values ('01', "บริษัทเริ่มต้นจำกัด");
-- insert into company(comCode, comName) values ('02', "บริษัทที่สองจำกัด");

drop table if exists kxlog;
create table kxlog (
  logNr         integer unsigned auto_increment,
  logTime       timestamp not null,
  logType       varchar(8) comment 'insert delete update query rollback login logfail execute',   
  user          varchar(16) not null comment 'user ที่ส่งคำสั่งทำงาน',
  program       varchar(16) comment 'ชื่อโปรแกรม',
  tableName     varchar(20) comment 'ไฟล์ ที่มีผลกระทบ',
  logData       varchar(300) comment 'ข้อมูลสำคัญก่อนการเปลี่ยนแปลง',
  primary key (logNr)
) comment = 'บันทึกการทำงาน';

set foreign_key_checks = 1;
