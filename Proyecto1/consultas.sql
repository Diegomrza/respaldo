select UNIX_TIMESTAMP(1) as time,
  1 as id
union all
SELECT
  UNIX_TIMESTAMP(id) as time,
  id as id
FROM
  datos.process
;