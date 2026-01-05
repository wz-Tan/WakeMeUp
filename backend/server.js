import express from "express";
import { createHash } from "crypto";
import {
  addLocation,
  createUser,
  signIn,
  getSavedLocation,
  deleteSavedLocation,
} from "./postgres.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
const port = 4000;

// JWT Check
function JWT_Middleware(req, res, next) {
  // Check if Header Exists
  const authHeader = req.headers.authorization;
  if (!authHeader) return;

  const token = authHeader.split(" ")[1]; // Retrieve Token

  // Verify Token Matches Signature
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.userId = payload.userId; // Pass On
    next();
  } catch (error) {
    res.json({ error });
    return;
  }
}

// Extracts Data from JSON
app.use(express.json());

// Create Port
app.listen(port, () => {
  console.log(`ExpressJS is listening on port ${port}`);
});

// GET Responses
app.get("/", (req, res) => {
  res.send("This Port is Running.");
});

// Middleware
app.use(JWT_Middleware);

// Create User
app.post("/user/create", async (req, res) => {
  const { username, email, password } = req.body;
  const encryptedPassword = createHash("sha256").update(password).digest("hex");

  let response = await createUser(username, email, encryptedPassword);
  console.log("Response from SignUp is", response);
  res.json(response);
});

// Sign In
app.post("/user/signIn", async (req, res) => {
  const { email, password } = req.body;

  const encryptedPassword = createHash("sha256").update(password).digest("hex");

  let response = await signIn(email, encryptedPassword);
  console.log("Response from SignIn is", response);

  // Return SignIn Response
  if (response.error) {
    console.log("Error is", response.error);
    res.json({ error: response.error });
  } else {
    let { userId, status } = response;

    const token = jwt.sign({ userId }, process.env.JWT_KEY);

    // Return Response and JWT
    res.json({ status, token });
  }
});

// Add Location
app.post("/location/add", async (req, res) => {
  const { locationName, latitude, longitude } = req.body;
  const userId = req.userId;

  let response = await addLocation(userId, locationName, latitude, longitude);

  res.json(response);
});

// Acquire Location at Home Page
app.post("/location/get", async (req, res) => {
  const userId = req.userId;

  let response = await getSavedLocation(userId);

  res.json(response);
});

// Delete Saved Location from Index
app.post("/location/delete", async (req, res) => {
  const userId = req.userId;
  const { latitude, longitude } = req.body;

  let response = await deleteSavedLocation(userId, latitude, longitude);

  res.json(response);
});
