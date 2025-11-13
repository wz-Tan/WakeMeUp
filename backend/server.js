const express = require("express");
const app = express();
const port = 4000;

// Create Port
app.listen(port, () => {
  console.log(`ExpressJS is listening on port ${port}`);
});

// GET Responses
app.get("/", (req, res) => {
  res.send("This Port is Running.");
});
