import express from "express";
import crypto, { createHash } from "crypto";
import { createUser, signIn } from "./postgres.js";

const app = express();
const port = 4000;

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

// Create User
app.post("/user/create", async (req, res) => {
  const { userName, email, password } = req.body;

  const encryptedPassword = createHash("sha256").update(password).digest("hex");

  let response = await createUser(userName, email, encryptedPassword);
  console.log("Response from SignUp is", response);
  res.json(response);
});

// Sign In
app.post("/user/signIn", async (req, res) => {
  const { email, password } = req.body;

  const encryptedPassword = createHash("sha256").update(password).digest("hex");

  let response = await signIn(email, encryptedPassword);
  console.log("Response from signIn is", response);
  res.json(response);
});
