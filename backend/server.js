const express = require("express");
const app = express();
const port = 4000;
import { init } from "./postgres";

// Wait for PostGresql to Init First
await init();

// TODO: Test Create User Function

// Create Port
app.listen(port, () => {
  console.log(`ExpressJS is listening on port ${port}`);
});

// GET Responses
app.get("/", (req, res) => {
  res.send("This Port is Running.");
});
