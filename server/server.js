const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2521",
  database: "expense_tracker"
});

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashed],
    (err) => {
      if (err) return res.status(400).send("User exists");
      res.send("Registered successfully");
    }
  );
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (result.length === 0) return res.status(400).send("User not found");

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.status(400).send("Wrong password");

      const token = jwt.sign({ id: user.id }, "SECRET_KEY", {
        expiresIn: "1d"
      });

      res.json({ token });
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));