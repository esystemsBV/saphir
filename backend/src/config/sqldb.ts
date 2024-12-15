import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: "auth-db1427.hstgr.io",
  user: "u365232941_saphirweb",
  password: "99Redzonek1ng",
  database: "u365232941_saphir",
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000,
});
