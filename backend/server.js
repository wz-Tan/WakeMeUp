import express from "express";
const app = express();
const port = 4000;
import { createUser, signIn } from "./postgres.js";

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
  console.log("Create User");
  const { userName, email, password } = req.body;
  let response = await createUser(userName, email, password);
  res.json(response);
});

// Sign In
app.post("/user/signIn", async (req, res) => {
  console.log("Sign In");
  const { email, password } = req.body;
  let response = await signIn(email, password);
  console.log("Response from signIn is", response);
  res.json(response);
});
