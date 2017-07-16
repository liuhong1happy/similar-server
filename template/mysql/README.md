## Install PostgreSQL

#### Docker

```shell
docker run --name some-postgres -p 127.0.0.1:5432:5432 -v /data/db/postgres:/var/lib/postgresql/data \
 -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=root -e POSTGRES_DB=admin \
 -d postgres
```

#### Others

see [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

## Start Server

```shell
npm start
```
