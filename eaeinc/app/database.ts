// DATABASE CONNECTION SETUP
import mysql from 'mysql2/promise';

//Creates a database connection pool.
export const db = mysql.createPool({
    host: "localhost",
    user: "backend_user",
    password: "eaeincdb",
    database: "ResearchPageDB"
})