import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',  //username
    host: 'localhost',
    database: 'wira_dashboard', //the data base name
    password: 'Ap79101123', //password for the database
    port: 5432,
  });

export const query = (text, params) => pool.query(text, params);
