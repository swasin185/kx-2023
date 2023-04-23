drop user if exists 'kxreport'@'%';
create user 'kxreport'@'%' identified by 'kxreport';
grant select, execute on *.* to 'kxreport'@'%';

drop user if exists 'kxserv'@'%';
create user 'kxserv'@'%' identified by 'kxserv';
grant select, execute, insert, delete, update, create temporary tables on *.* to 'kxserv'@'%';

drop user if exists 'kxadmin'@'%';
create user 'kxadmin'@'%' identified by 'kxadmin';
grant all on *.* to 'kxadmin'@'%';

drop database if exists kxtest;
create database kxtest;
