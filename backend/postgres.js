import "dotenv/config";
import { Pool } from "pg";

const USERS = "users";
const LOCATIONS = "locations";

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
    await client.query(`CREATE TABLE IF NOT EXISTS ${USERS}(
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
    let userExists = await checkUserExists(email);

    if (userExists) {
      return { error: "User Already Exists" };
    }

    await client.query(
      `INSERT INTO ${USERS} (name, email, password)
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
      `SELECT * FROM ${USERS}
      where email = $1
      `,
      [email],
    );
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error when checking user exists, ", err);
  }
}

// Match Sign In Credentials
export async function signIn(email, password) {
  console.log("Sign in called");
  try {
    // Find Email and Password Match
    let result = await client.query(
      `SELECT * from ${USERS} where email=$1 AND password=$2`,
      [email, password],
    );

    // No Match
    if (!result.rowCount) {
      let emailExists = await client.query(
        `SELECT * from ${USERS} where email=$1`,
        [email],
      );

      // Password Issue
      if (emailExists.rowCount > 0) {
        return { error: "Incorrect Password" };
      } else {
        return { error: "User Not Found" };
      }
    }

    // Found User, UserID for JWT
    return { status: 200, userId: result.rows[0].id };
  } catch (err) {
    return { error: `Error Retrieving Sign In Credentials: ${err}` };
  }
}

// Add Location to User DB
export async function addLocation(userId, locationData) {
  console.log("Add Location Called");
  try {
    const result = await client.query(
      `INSERT INTO ${LOCATIONS} (userId, location)
      VALUES ($1,$2)`,
      [userId, locationData],
    );

    console.log("Result of adding location is", result);
  } catch (err) {
    console.log("Error adding location into database", err);
  }
}
