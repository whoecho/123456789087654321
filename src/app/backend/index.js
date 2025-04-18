const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const PORT = 4000;
const SECRET = "jwt-secret";

app.use(cors());
app.use(express.json());

const users = []; // Хранение пользователей в памяти

// Регистрация
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.json({ message: "Registered successfully" });
});

// Логин
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Защищённый маршрут
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}! This is protected data.` });
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`),
);
