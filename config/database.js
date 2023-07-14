import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: `${process.env.DB_HOST}`,
    user:`${process.env.DB_USER}`,
    port: `3306`,
    password: `${process.env.DB_PASS}`,
    database: `${process.env.DB_NAME}`
})

export default pool;