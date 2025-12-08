import express from "express";
const app = express();
const port = 4000;
import { init, createUser, signIn } from "./postgres.js";

// Extracts Data from JSON
app.use(express.json());

// Wait for PostGresql to Init First
await init();

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
  await createUser(userName, email, password);
  res.send();
});

// Sign In
app.post("/user/signIn", async (req, res) => {
  console.log("Sign In");
  const { email, password } = req.body;
  const userExists = await signIn(email, password);
  userExists ? console.log("User Found") : console.log("User not found");
  res.send();
});
