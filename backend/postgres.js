import "dotenv/config";
import { Pool } from "pg";

// Table Names
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
  } catch (error) {
    console.log("error creating table ", error);
  }
}

// Auth
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
  } catch (error) {
    return { error: `error when creating user, ${error}` };
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
  } catch (error) {
    console.error("error when checking user exists, ", error);
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
  } catch (error) {
    return { error: `error Retrieving Sign In Credentials: ${error}` };
  }
}

export async function getUserInfo(userId) {
  console.log("Getting user info...");
  try {
    const result = await client.query(
      `
      SELECT name, email from ${USERS}
      WHERE id = $1
      `,
      [userId],
    );

    return { status: 200, info: result.rows[0] };
  } catch (error) {
    return { error };
  }
}

// Core Functions
// Add Location to User DB
export async function addLocation(userId, locationName, latitude, longitude) {
  try {
    const result = await client.query(
      `INSERT INTO ${LOCATIONS} (userId, location_name, latitude, longitude)
      VALUES ($1,$2,$3,$4)`,
      [userId, locationName, latitude, longitude],
    );

    return { status: 200 };
  } catch (error) {
    console.log("error adding location into database", error);
    return { error };
  }
}

export async function getSavedLocation(userId) {
  try {
    const result = await client.query(
      `SELECT * from ${LOCATIONS} where userId=$1`,
      [userId],
    );

    return { status: 200, location: result.rows };
  } catch (error) {
    console.log("error acquiring user location", error);
    return { error };
  }
}

export async function deleteSavedLocation(userId, latitude, longitude) {
  console.log("Deleting Saved Location");
  try {
    await client.query(
      `DELETE from ${LOCATIONS} WHERE userId=$1 and latitude=$2 and longitude=$3`,
      [userId, latitude, longitude],
    );

    return { status: 200 };
  } catch (error) {
    console.log("error deleting saved location", error);
    return { error };
  }
}

export async function editSavedLocationName(
  userId,
  latitude,
  longitude,
  location_name,
) {
  console.log("Editing saved location name");
  console.log(
    `User ID is ${userId}, latitude is ${latitude}, longitude is ${longitude}`,
  );

  try {
    await client.query(
      `UPDATE ${LOCATIONS}
      SET location_name = $1
      WHERE userId=$2 and latitude=$3 and longitude=$4
      `,
      [location_name, userId, latitude, longitude],
    );

    return { status: 200 };
  } catch (error) {
    return { error };
  }
}
