const express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  port = process.env.PORT || 3000;

const dbHandler = require("./dbHandler");

// Database
const db = require("./config/database");

// Test DB
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Error " + err));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// app.post("/login", (req, res) => {
//   const user = req.body.username;
//   const password = req.body.password;
//   res.status(200).json({ data: `Welcome Abhinav ${user}` });
// });

app.get("/user", dbHandler.getUsers);
app.post("/login", dbHandler.getUserById);
app.post("/save_css", dbHandler.createCss);
app.get("/get_css", dbHandler.getCssById);
app.post("/submit_css", dbHandler.submitCss);

app.get("/", (req, res) => {
  res.send("<h1>Direct Access Not Allowed<h1>");
});
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
