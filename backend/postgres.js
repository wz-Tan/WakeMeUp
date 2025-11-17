import "dotenv/config";
import { Pool } from "pg";

const TABLENAME = "users";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: true,
  },
});

// Connect to Pool (Query Connection System)
const client = await pool.connect();

// Create Table for Use
export async function init() {
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS ${TABLENAME}(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
    )`);

    console.log("Table Created");
  } catch (err) {
    console.log("Error creating table ", err);
  }
}

async function AddUser(name, email, password) {
  try {
    await client.query(`INSERT INTO ${TABLENAME} (name, email, password)
        VALUES (${name},${email},${password})
      `);
  } catch (err) {
    console.error("Error when creating user, ", err);
  }
}

// Start Listening For Changes Here
