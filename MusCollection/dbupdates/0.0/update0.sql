create table dbo.db_version(
 id int identity(1,1) not null primary key,
 major int not null,
 minor int not null,
 version int not null
)

$$

create procedure dbo.up_db_version_set(
  @major int,
  @minor int,
  @version int
)
as
begin

  merge dbo.db_version as v
    using (
    select @major as major,
           @minor as minor,
           @version as version
    ) as s
    on v.major=s.major and v.minor=s.minor
  when matched then
    update set
       version = s.version
  when not matched then
    insert (major, minor, version)
    values (s.major, s.minor, s.version);
end


$$
