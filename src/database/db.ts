import { createPool } from "mysql2/promise";

const port = parseInt(process.env.MYSQLDB_PORT || "3306");

export const pool = createPool({
  port,
  host: process.env.MYSQLDB_HOST,
  user: "root",
  password: process.env.MYSQLDB_ROOT_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
});

export default pool;
