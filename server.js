
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");
let data = [];
if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE));
}

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/log", (req, res) => {
  const entry = { ...req.body, timestamp: req.body.timestamp || new Date().toISOString() };
  data.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.get("/logs", (req, res) => res.json(data));

app.post("/clear", (req, res) => {
  data = [];
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
