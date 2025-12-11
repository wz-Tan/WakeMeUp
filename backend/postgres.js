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
  } catch (err) {
    console.log("Error creating table ", err);
  }
}

export async function createUser(name, email, password) {
  try {
    let userExists = checkUserExists(email);

    if (userExists) {
      return { error: "User Already Exists" };
    }

    await client.query(
      `INSERT INTO ${TABLENAME} (name, email, password)
        VALUES ($1,$2,$3)
      `,
      [name, email, password],
    );
    return { status: 200 }; // On Success Return Code 200
  } catch (err) {
    return { error: `Error when creating user, ${err}` };
  }
}

async function checkUserExists(email) {
  try {
    let result = await client.query(
      `SELECT * FROM ${TABLENAME}
      where email = $1
      `,
      [email],
    );
    return result.rowCount > 0 ? true : false;
  } catch (err) {
    console.error("Error when checking user exists, ", err);
  }
}

// Match Sign In Credentials
export async function signIn(email, password) {
  console.log("Sign in called");
  try {
    let result = await client.query(
      `SELECT * from ${TABLENAME} where email=$1 AND password=$2`,
      [email, password],
    );

    // Found User (or Not)
    return result.rowCount > 0 ? { status: 200 } : { error: "User Not Found" };
  } catch (err) {
    return { error: `Error Retrieving Sign In Credentials: ${err}` };
  }
}

// Start Listening For Changes Here
