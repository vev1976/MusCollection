create table dbo.member(
id int identity(1,1) primary key,
first_name varchar(64) not null,
last_name varchar(64) not null,
band_id int not null,
birthday date,
member_from date,
member_to date,
profession varchar(128)
)

$$