import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: true,
  },
});

async function setup() {
  const client = await pool.connect();
  console.log("Connected To The Database ", client);
}

setup();
