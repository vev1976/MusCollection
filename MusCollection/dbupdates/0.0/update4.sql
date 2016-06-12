create table dbo.album(
id int identity(1,1) primary key,
band_id int not null,
name varchar(128),
[year] int not null
)

$$