import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: true,
  },
});

const client = await pool.connect();

async function createTable() {
  // Drop the table if it already exists
  await client.query("DROP TABLE IF EXISTS userinfo;");

  await client.query(`
    CREATE TABLE user_info(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      age INT
    );
    `);

  console.log("Created Table");
}

createTable();

async function addLocation() {
  await client.query("");
}
