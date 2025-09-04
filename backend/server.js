const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const session = require("cookie-session");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ✅ Allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",                  // local
  "https://auth-login-logout.vercel.app/"    // vercel deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_KEY || "dev_secret_key"],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

// Database setup (database file in backend/)
const dbFile = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error("DB open error:", err);
  else console.log("Connected to SQLite DB:", dbFile);
});

db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)",
  (err) => {
    if (err) console.error("Create table error:", err);
  }
);

// Register
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (row) return res.status(400).json({ message: "Email already exists" });

    const hashed = bcrypt.hashSync(password, 10);
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed], function (err) {
      if (err) return res.status(500).json({ message: "Error creating user" });
      req.session.userId = this.lastID;
      res.status(201).json({ user: { id: this.lastID, email } });
    });
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email } });
  });
});

// Get session user
app.get("/api/auth/user", (req, res) => {
  if (!req.session || !req.session.userId) return res.json({ user: null });
  db.get("SELECT id, email FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    if (err || !user) return res.json({ user: null });
    res.json({ user });
  });
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ message: "Logged out" });
});

// Protected sample
app.get("/api/dashboard", (req, res) => {
  if (!req.session || !req.session.userId) return res.status(401).json({ message: "Unauthorized" });
  db.get("SELECT id, email FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    if (err || !user) return res.status(500).json({ message: "Error" });
    res.json({ message: "Welcome to dashboard", user, timestamp: new Date().toISOString() });
  });
});

// Health
app.get("/api/status", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
