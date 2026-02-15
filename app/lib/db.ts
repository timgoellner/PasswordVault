import { Client } from 'pg'

const db = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE
})

await db.connect()

const query = `
BEGIN;
CREATE TABLE IF NOT EXISTS password (
  id          serial PRIMARY KEY,
  cipher      varchar(200) NOT NULL,
  iv          varchar(100) NOT NULL,
  salt        varchar(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS entry (
  id          serial PRIMARY KEY,
  timestamp   timestamp DEFAULT CURRENT_TIMESTAMP,
  active      boolean DEFAULT TRUE,
  location1   varchar(30) NOT NULL,
  location2   varchar(30),
  location3   varchar(30),
  username    varchar(50),
  email       varchar(50),
  passwordid  integer NOT NULL REFERENCES Password(id)
);
COMMIT;`
db.query(query)

export default db