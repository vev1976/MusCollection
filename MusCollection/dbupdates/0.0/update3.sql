create table dbo.song(
id int identity(1,1) primary key,
name varchar(256) not null,
[year] int,
band_id int not null,
album_id int,
long_sec int,
content varchar(max),
mp3 binary
)

$$
