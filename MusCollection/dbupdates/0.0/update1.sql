create table dbo.band(
id int identity(1,1) primary key,
name varchar(128) not null,
style_id int,
creation_date date,
country char(2)
)

$$