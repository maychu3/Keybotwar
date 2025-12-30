const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(express.static("public"));
app.use(express.json());

const KEY_LIFE = 48 * 60 * 60 * 1000; // 48h
const BYPASS_LINK = "https://LINK_4M_CUA_BAN"; // 👈 DÁN LINK 4M Ở ĐÂY

function loadKeys() {
  if (!fs.existsSync("keys.json")) return {};
  return JSON.parse(fs.readFileSync("keys.json"));
}

function saveKeys(data) {
  fs.writeFileSync("keys.json", JSON.stringify(data, null, 2));
}

function randomKey() {
  return crypto.randomBytes(8).toString("hex").toUpperCase();
}

app.get("/api/check", (req, res) => {
  const keys = loadKeys();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();

  if (!keys[ip] || now > keys[ip].expire) {
    return res.json({ expired: true, bypass: BYPASS_LINK });
  }

  res.json({ expired: false, ...keys[ip] });
});

app.get("/api/getkey", (req, res) => {
  const keys = loadKeys();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();

  if (keys[ip] && now < keys[ip].expire) {
    return res.json(keys[ip]);
  }

  const data = {
    key: randomKey(),
    created: now,
    expire: now + KEY_LIFE
  };

  keys[ip] = data;
  saveKeys(keys);
  res.json(data);
});

app.listen(3000);
