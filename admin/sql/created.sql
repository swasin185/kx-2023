drop database payroll;
create database payroll;
use payroll;

set foreign_key_checks = 0;

-- kxview/src/Library.ts
-- drop table if exists kxlevel;
-- create table kxlevel (
--   level         smallint unsigned not null,
--   descript      varchar(32) default "สิทธิการใช้งาน",
--   primary key (level)
-- ) comment = 'ระดับการใช้งาน';
-- insert into kxlevel values (0, "Read Only");
-- insert into kxlevel values (1, "Routine User");
-- insert into kxlevel values (2, "Simple User");
-- insert into kxlevel values (3, "Advance User");
-- insert into kxlevel values (4, "Supervisor");
-- insert into kxlevel values (5, "Manager");
-- insert into kxlevel values (6, "Administrator");
-- insert into kxlevel values (7, "Programmer");
-- insert into kxlevel values (8, "Developer");
-- insert into kxlevel values (9, "GOD");

drop table if exists kxuser;
create table kxuser (
  user          varchar(16) not null,
  name          varchar(40) default null,
  descript      varchar(60) default null,
  level         smallint unsigned not null default 0,
  role          varchar(16) default null,
  passwd        varchar(32) default null,
  passwdTime    timestamp default null,
  passwd2       varchar(32) default null,
  passwd2Time   timestamp default null,
  created       date default curdate(),
  primary key (user)
) comment = 'ชื่อผู้ใช้งานระบบ';
insert into kxuser(user, name, descript, level)
values ('admin', 'แอดมินไงจะใครละ', 'ผู้ดูแลระบบ', 9);
insert into kxuser(user, name, descript, level)
values ('tom', 'ทอม', 'ทดสอบผู้ใช้ทั่วไป', 1);

drop table if exists kxpermission;
create table kxpermission (
  user          varchar(16) not null,
  program       varchar(16) not null,
  level         smallint unsigned not null default 0 comment 'ระดับการใช้งาน 0 - 9',
  used          integer unsigned not null default 0 comment 'จำนวนครั้งที่ใช้',
  foreign key (user) references kxuser(user) on delete cascade,
  primary key (user, program)
) comment = 'สิทธิการใช้โปรแกรม';
insert into kxpermission values ('tom','TestPanel',1,0);
insert into kxpermission values ('tom','TestReport',1,0);

drop table if exists company;
create table company (
  comCode       varchar(2) not null,
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
