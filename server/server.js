"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "..", "public");
const DATA = path.join(__dirname, "..", "data");
const LEADS = path.join(DATA, "leads.ndjson");

const PRODUCTS = [
  { id: "meridian", name: "Meridian", tagline: "Automatic · 40mm · Rose gold", price: 8400 },
  { id: "nocturne", name: "Nocturne", tagline: "Moonphase · 38mm · Black steel", price: 11200 },
  { id: "equinox", name: "Equinox", tagline: "Chronograph · 42mm · Titanium", price: 14900 }
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function send(res, code, body, type) {
  res.writeHead(code, {
    "Content-Type": type || "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(body);
}

function json(res, code, obj) {
  send(res, code, JSON.stringify(obj));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleLead(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req, 10000));
  } catch (e) {
    return json(res, 400, { error: "Invalid request." });
  }
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const interest = String(body.interest || "").slice(0, 40);
  if (!name || !EMAIL.test(email)) {
    return json(res, 400, { error: "Name and valid email are required." });
  }
  fs.mkdirSync(DATA, { recursive: true });
  const row = JSON.stringify({ name, email, interest, ts: new Date().toISOString() });
  fs.appendFile(LEADS, row + "\n", (err) => {
    if (err) return json(res, 500, { error: "Could not save." });
    json(res, 201, { ok: true });
  });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, "Forbidden", "text/plain");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "Not found", "text/plain");
    send(res, 200, buf, MIME[path.extname(file)] || "application/octet-stream");
  });
}

http
  .createServer((req, res) => {
    const pathname = new URL(req.url, "http://x").pathname;
    if (req.method === "GET" && pathname === "/api/products") return json(res, 200, PRODUCTS);
    if (req.method === "POST" && pathname === "/api/lead") return handleLead(req, res);
    if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
    send(res, 405, "Method not allowed", "text/plain");
  })
  .listen(PORT, () => console.log("AURUM running on http://localhost:" + PORT));
