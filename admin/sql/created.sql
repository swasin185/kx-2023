set foreign_key_checks = 0;

drop user if exists 'kxreport'@'%';
create user 'kxreport'@'%' identified by 'kxreport';
grant select, execute on *.* to 'kxreport'@'%';

drop user if exists 'kxserv'@'%';
create user 'kxserv'@'%' identified by 'kxserv';
grant select, execute, insert, delete, update on *.* to 'kxserv'@'%';

drop database if exists kxtest;
create database kxtest; -- default character set 'tis620' default collate 'tis620_thai_ci';

use kxtest;

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
values ('tom', 'ทอม', 'ทดสอบผู้ใช้ทั่วไป [yesiam]', 1);
insert into kxuser(user, name, descript, level)
values ('ai', 'ปัญรวี เสงี่ยมกุล', 'KBC 192.168.1.210', 6);
insert into kxuser(user, name, descript, level)
VALUES('amon', 'อมร ยิ่งสกุล', 'ชั้นวางสินค้า', 0);
insert into kxuser(user, name, descript, level)
VALUES('amonrat', 'อมรรัตน์ โฉมโต', '+ย้ายคลัง+สต็อคตรวจนับ+บิลขาย(4)', 1);
insert into kxuser(user, name, descript, level)
VALUES('ann', 'เปรมฤดี บัวสุวรรณ', 'Premruedee Buasuwan', 6);
insert into kxuser(user, name, descript, level)
VALUES('anucha', 'อนุชา นุด', 'ลาออก', 2);
insert into kxuser(user, name, descript, level)
VALUES('aod', 'เชษฐา ณ นคร', 'เสนอราคา', 1);
insert into kxuser(user, name, descript, level)
VALUES('aof', 'อ๊อฟ', 'ชั้นวางสินค้า XXX', 1);
insert into kxuser(user, name, descript, level)
VALUES('arthid', 'อาทิตย์ อนุจร', 'บิลขาย 192.168.1.219', 1);
insert into kxuser(user, name, descript, level)
VALUES('aus', 'อัศมณี ไกรเลิศ', 'บัญชี 192.168.1.235', 1);
insert into kxuser(user, name, descript, level)
VALUES('bang', 'พรศักดิ์ เสงี่ยมกุล', 'วิเคราะห์ข้อมูล 192.168.1.208', 0);
insert into kxuser(user, name, descript, level)
VALUES('ben', 'Benjawan Yothanan', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('daraporn', 'ดาราพร ต้นข้าว', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('fang', 'นรารัตน์ ชูสุวรรณ', 'บิลขาย 192.168.1.212', 1);
insert into kxuser(user, name, descript, level)
VALUES('hua', 'สดศรี จิรเสงี่ยมกุล', '192.168.1.236', 8);
insert into kxuser(user, name, descript, level)
VALUES('jan', 'จันทิมา มัตตะพงศ์', '192.168.1.229 โปรโมชั่น', 3);
insert into kxuser(user, name, descript, level)
VALUES('janwisa', 'จันทร์วิสา คงกาล', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('jariya', 'จริยา จันทรจิตร', 'แนน', 1);
insert into kxuser(user, name, descript, level)
VALUES('jeab', 'เดือนรุ่ง เหลี่ยมคุณ', 'ชั้นวางสินค้า', 1);
insert into kxuser(user, name, descript, level)
VALUES('jiraporn', 'จิราภรณ์ จันทร์นิ่ม', 'บิลขาย 192.168.1.213', 1);
insert into kxuser(user, name, descript, level)
VALUES('jirawan', 'จีรวรรณ แซ่เล่า', '+บิลขาย(4)', 4);
insert into kxuser(user, name, descript, level)
VALUES('kanyarat', 'กัญญารัตน์ ภิรมย์รักษ์', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('kit', 'กิตติสุข กรแก้ว', 'เสนอราคา 192.168.1.215', 1);
insert into kxuser(user, name, descript, level)
VALUES('kung', 'สุกัญญา โกยกิจเจริญ', 'สโตร์ 192.168.1.239', 1);
insert into kxuser(user, name, descript, level)
VALUES('kwan', 'ศิริวรรณ สงวนวงศ์', 'จัดซื้อ 192.168.1.225', 1);
insert into kxuser(user, name, descript, level)
VALUES('kwang', 'นันทมนัส บุญสว่าง', 'ชั้นวางสินค้า', 1);
insert into kxuser(user, name, descript, level)
VALUES('lek', 'นิลวดี รอดอินทร์', 'ฝ่ายขาย TR 192.168.1.221', 1);
insert into kxuser(user, name, descript, level)
VALUES('mind', 'มนัสนันท์ จันทร์ดง', 'จัดซื้อ 192.168.1.224', 1);
insert into kxuser(user, name, descript, level)
VALUES('nat', 'เนตรดาว มุณีพู', 'บัญชี 192.168.1.232', 1);
insert into kxuser(user, name, descript, level)
VALUES('natchaya', 'Natchaya Aunaon', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('nattanit', 'ณัฐธนิต ตันทวานิช', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('nipon', 'นิพนธ์ บุญยกบัณฑิต', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('Non', 'ศักดินนท์  แซ่เหงา', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('nong', 'วิมลรัตน์ เสงี่ยมกุล', '', 8);
insert into kxuser(user, name, descript, level)
VALUES('noon', 'นุชนาฎ โฉมโต', 'บิลซื้อ 192.168.1.228', 1);
insert into kxuser(user, name, descript, level)
VALUES('nussara', 'นุชสรา คุ้มบ้าน', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('nut', 'sasirat janard', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('oil', 'ออย์ เทรดดิ้ง', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('oranong', 'อรอนงค์ ห่อเพชร์', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('orapan', 'อรพรรณ เลิศรักษา', 'สโตร์ 192.168.1.238', 1);
insert into kxuser(user, name, descript, level)
VALUES('paew', 'กาญจนา สัยสด', 'บิลขาย 192.168.1.214', 1);
insert into kxuser(user, name, descript, level)
VALUES('pawis', 'ภวิศ เสงี่ยมกุล', 'วิเคราะห์ข้อมูล 192.168.1.209', 0);
insert into kxuser(user, name, descript, level)
VALUES('pc', 'PC สินค้ายี่ห้อต่างๆ', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('phone', 'Phanupong KlangAnan', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('phueng', 'ยุภาภรณ์ ชูภักดิ์', 'บิลขาย 192.168.1.222', 1);
insert into kxuser(user, name, descript, level)
VALUES('pirach', 'ไพรัช พันทิพย์', 'PC', 1);
insert into kxuser(user, name, descript, level)
VALUES('pirat', 'ไพรัตน์ จำปาทอง', 'ชั้นวางสินค้า', 1);
insert into kxuser(user, name, descript, level)
VALUES('pongsa', 'พงศ์ธร พันธุวารี', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('pphad', 'แพรวเพชร ทวีสุวรรณ', 'ชั้นวางสินค้า', 1);
insert into kxuser(user, name, descript, level)
VALUES('prateep', 'ประทีป มั่งเลอลักษณ์', 'มะตูม', 1);
insert into kxuser(user, name, descript, level)
VALUES('pu', 'ประภัสสร ปานบุดดา', 'ชั้นวางสินค้า', 1);
insert into kxuser(user, name, descript, level)
VALUES('rith', 'ฤทธิ์ ฤทธิ์ตั้งตระกูล', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('si', 'ศิราณี สร้างเมือง', 'บัญชี 192.168.1.233', 1);
insert into kxuser(user, name, descript, level)
VALUES('sirima', 'สิริมา จตุปาริสุทธิ์', 'ลาออก', 2);
insert into kxuser(user, name, descript, level)
VALUES('somboon', 'สมบูรณ์ กัลทลิกา', 'PC', 1);
insert into kxuser(user, name, descript, level)
VALUES('sumpan', 'สัมพันธ์  รักษา', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('supaporn', 'สุภาภรณ์ สงโสม', 'ลาออก', 2);
insert into kxuser(user, name, descript, level)
VALUES('suwit', 'สุวิทย์ เสงี่ยมกุล', 'วิเคราะห์ข้อมูล', 0);
insert into kxuser(user, name, descript, level)
VALUES('tanwa', 'ธันวา สโตร์สายไฟ', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('tassanee', 'ทัศนีย์ พัฒสังวาล', 'บิลขาย 192.168.1.216', 1);
insert into kxuser(user, name, descript, level)
VALUES('thawat', 'ธวัชชัย อินทองปาน', 'PC', -1);
insert into kxuser(user, name, descript, level)
VALUES('user01', 'นายกรวินทร์ สุขาเขิน (ก้าน)', 'ฝึกงานคอมพิวเตอร์', 0);
insert into kxuser(user, name, descript, level)
VALUES('user02', 'นายวชิรญาณ เอ่งฉ้วน (ซีโฟ)', 'ฝึกงานคอมพิวเตอร์', 0);
insert into kxuser(user, name, descript, level)
VALUES('user03', 'นายพันธกานต์ เจริญทรัพย์ (เต้)', 'ฝึกงานคอมพิวเตอร์', 0);
insert into kxuser(user, name, descript, level)
VALUES('utaiwan', 'อุทัยวรรณ หีตอักษร', 'บัญชี 192.168.1.234', 1);
insert into kxuser(user, name, descript, level)
VALUES('wanlisa', 'วรรลิสา พุฒสาม', 'ลาออก', 2);
insert into kxuser(user, name, descript, level)
VALUES('weera', 'วีระ จิรเสงี่ยมกุล', '', 6);
insert into kxuser(user, name, descript, level)
VALUES('witchuko', 'วิชชุกร ช่างเหล็ก', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('xin', 'โกสิ่น', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('yeam', 'กัญชพร บุญเสน', 'ฝ่ายจัดซื้อ', 2);
insert into kxuser(user, name, descript, level)
VALUES('yok', 'บุญเรือน ทรัพย์ทวี', 'ชั้นวางสินค้า', 1);
insert into kxuser(user, name, descript, level)
VALUES('yupa', 'ยุพา จงกลบาล', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('zAcc1', 'Role ฝ่ายบัญชี', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('zAcc2', 'Role ฝ่ายบัญชี พิเศษ', '', 4);
insert into kxuser(user, name, descript, level)
VALUES('zAcc3', 'Role ฝ่ายบัญชี admin', '', 6);
insert into kxuser(user, name, descript, level)
VALUES('zAdmin1', 'Role ผู้ดูแลระบบ 1', '', 6);
insert into kxuser(user, name, descript, level)
VALUES('zAdmin2', 'Role ผู้ดูแลระบบ super', '', 9);
insert into kxuser(user, name, descript, level)
VALUES('zAnl', 'ฝ่ายวิเคราะห์ข้อมูล', '', 0);
insert into kxuser(user, name, descript, level)
VALUES('zPC', 'Role PC ', '', 0);
insert into kxuser(user, name, descript, level)
VALUES('zPurch1', 'Role ฝ่ายจัดซื้อ คีย์บิลซื้อ', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('zPurch2', 'Role ฝ่ายจัดซื้อ แก้ไขข้อมูล', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('zPurch3', 'Role ฝ่ายจัดซื้อ แก้ไขพิเศษ', '', 4);
insert into kxuser(user, name, descript, level)
VALUES('zSale0', 'Role ฝ่ายขาย พิมพ์ป้าย เช็คราคา', 'ตรวจเช็คราคา', 0);
insert into kxuser(user, name, descript, level)
VALUES('zSale1', 'Role ฝ่ายขาย เปิดบิล ลดหนี้', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('zSale2', 'Role ฝ่ายขาย แก้ไขข้อมูล', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('zSale3', 'Role ฝ่ายขาย แก้ไขข้อมูล dc.ขั้น3', '', 3);
insert into kxuser(user, name, descript, level)
VALUES('zSale4', 'Role ฝ่ายขาย Admin dc.ขั้น4', '', 4);
insert into kxuser(user, name, descript, level)
VALUES('zStk1', 'Role ฝ่ายคลัง จัดของ', '', 1);
insert into kxuser(user, name, descript, level)
VALUES('zStk2', 'Role ฝ่ายคลัง พิเศษ', '', 2);
insert into kxuser(user, name, descript, level)
VALUES('zZero', 'ไม่มีสิทธิใช้โปรแกรมใดๆเลย', '', -1);

-- drop table if exists kxprogram;
-- create table kxprogram (
--  program       varchar(16) not null,
--  descript      varchar(48),
--  catagory      varchar(32),
--  icon			varchar(32),
--  menuOrder     smallint unsigned,
--  primary key (program)
-- ) comment = 'โปรแกรม ฟอร์ม รายงาน';

-- insert into kxprogram values ('KxUser','ชื่อผู้ใช้/รหัสผ่าน','Setup','', 1);
-- insert into kxprogram values ('KxProgram','โปรแกรม/ฟอร์ม/รายงาน','Setup','',2);
-- insert into kxprogram values ('KxLevel','ระดับผู้ใช้','Setup','',3);
-- insert into kxprogram values ('KxPermission','สิทธิการใช้งาน','Setup','',4);
-- insert into kxprogram values ('KxLogs','บันทึกการใช้งาน','Setup','',5);
-- insert into kxprogram values ('Company','ข้อมูลบริษัท','Setup','',6);
-- insert into kxprogram values ('Employee','ข้อมูลพนักงาน','Setup','',7);

drop table if exists kxpermission;
create table kxpermission (
  user          varchar(16) not null,
  program       varchar(16) not null,
  level         smallint unsigned not null default 0,
  used          integer unsigned not null default 0,
  foreign key (user) references kxuser(user) on delete cascade,
--  foreign key (program) references kxprogram(program) on delete cascade,
--  foreign key (level) references kxlevel(level),
  primary key (user, program)
) comment = 'สิทธิการใช้โปรแกรม และระดับการใช้งาน จำนวนครั้งการใช้';
insert into kxpermission values ('tom','TestPanel',1,0);
insert into kxpermission values ('tom','TestReport',1,0);

drop table if exists company;
create table company (
  comCode       varchar(8) not null,
  comName       varchar(64) not null,
  primary key (comCode)
) comment = 'บริษัท-ข้อมูลของแต่ละบริษัท';

insert into company values ('01', "บริษัทเริ่มต้นจำกัด");
insert into company values ('02', "บริษัทที่สองจำกัด");

drop table if exists kxlogs;
create table kxlogs (
  logNr         integer unsigned auto_increment,
  logTime       timestamp not null,
  user          varchar(16) not null,
  logType       varchar(16),   
  program       varchar(16),
  objName       varchar(20),
  logData       varchar(256),
  primary key (logNr)
) comment = 'บันทึกการทำงาน insert delete update query rollback login logfail execute daily monthly';

set foreign_key_checks = 1;