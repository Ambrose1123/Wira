import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config(); // Load environment variables from .env file
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT || 5432, // Default to 5432 if not provided
    ssl: {
      rejectUnauthorized: false, // Use this if RDS requires SSL
    }
  });

export const query = (text, params) => pool.query(text, params);
