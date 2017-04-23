## Install Mongodb

#### Docker

```shell
docker run -it -p 127.0.0.1:27017:27017 -v /data/db/mongo:/data/db --name some-mongo -d mongo
docker exec -it some-mongo mongo admin
db.createUser({ user: 'root', pwd: '123456', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
```

#### Others

see [http://www.mongodb.org/downloads](http://www.mongodb.org/downloads)

## Start Server

```shell
npm start
```
