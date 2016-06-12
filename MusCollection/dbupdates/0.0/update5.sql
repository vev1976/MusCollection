create table dbo.style(
id int identity(1,1) primary key,
name varchar(128)
)

$$

insert into dbo.style(name)
values ('pop'),
       ('rock'),
       ('blues')

$$