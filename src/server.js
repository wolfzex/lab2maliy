import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== In-memory data =====
let users = [];       // { id, name }
let categories = [];  // { id, title }
let records = [];     // { id, user_id, category_id, created_at, amount }

let userIdSeq = 1;
let categoryIdSeq = 1;
let recordIdSeq = 1;

// ===== Helpers =====
const notFound = (res, entity = "Resource") => res.status(404).json({ error: `${entity} not found` });
const badRequest = (res, message = "Bad request") => res.status(400).json({ error: message });

// ===== USERS =====
app.get("/user/:user_id", (req, res) => {
  const id = Number(req.params.user_id);
  const user = users.find(u => u.id === id);
  if (!user) return notFound(res, "User");
  res.json(user);
});

app.delete("/user/:user_id", (req, res) => {
  const id = Number(req.params.user_id);
  const before = users.length;
  users = users.filter(u => u.id !== id);
  records = records.filter(r => r.user_id !== id);
  if (users.length === before) return notFound(res, "User");
  res.status(204).send();
});

app.post("/user", (req, res) => {
  const { name } = req.body || {};
  if (!name) return badRequest(res, "Field 'name' is required");
  const user = { id: userIdSeq++, name };
  users.push(user);
  res.status(201).json(user);
});

app.get("/users", (req, res) => {
  res.json(users);
});

// ===== CATEGORIES =====
app.get("/category", (req, res) => {
  res.json(categories);
});

app.post("/category", (req, res) => {
  const { title } = req.body || {};
  if (!title) return badRequest(res, "Field 'title' is required");
  const category = { id: categoryIdSeq++, title };
  categories.push(category);
  res.status(201).json(category);
});

// DELETE /category?category_id=1
app.delete("/category", (req, res) => {
  const id = Number(req.query.category_id);
  if (!id) return badRequest(res, "Query 'category_id' is required");
  const before = categories.length;
  categories = categories.filter(c => c.id !== id);
  records = records.filter(r => r.category_id !== id);
  if (categories.length === before) return notFound(res, "Category");
  res.status(204).send();
});

// ===== RECORDS =====
app.get("/record/:record_id", (req, res) => {
  const id = Number(req.params.record_id);
  const rec = records.find(r => r.id === id);
  if (!rec) return notFound(res, "Record");
  res.json(rec);
});

app.delete("/record/:record_id", (req, res) => {
  const id = Number(req.params.record_id);
  const before = records.length;
  records = records.filter(r => r.id !== id);
  if (records.length === before) return notFound(res, "Record");
  res.status(204).send();
});

app.post("/record", (req, res) => {
  const { user_id, category_id, amount } = req.body || {};
  if (!user_id || !category_id || typeof amount !== "number") {
    return badRequest(res, "Fields 'user_id', 'category_id', 'amount' are required (amount must be a number)");
  }
  const userExists = users.some(u => u.id === Number(user_id));
  const categoryExists = categories.some(c => c.id === Number(category_id));
  if (!userExists) return badRequest(res, "User does not exist");
  if (!categoryExists) return badRequest(res, "Category does not exist");

  const record = {
    id: recordIdSeq++
    , user_id: Number(user_id)
    , category_id: Number(category_id)
    , created_at: new Date().toISOString()
    , amount
  };
  records.push(record);
  res.status(201).json(record);
});

// GET /record?user_id=&category_id=
app.get("/record", (req, res) => {
  const { user_id, category_id } = req.query;
  if (!user_id && !category_id) {
    return badRequest(res, "Provide at least one query param: user_id or category_id");
  }
  let filtered = records;
  if (user_id) filtered = filtered.filter(r => r.user_id === Number(user_id));
  if (category_id) filtered = filtered.filter(r => r.category_id === Number(category_id));
  res.json(filtered);
});

// Root
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "expense-rest-api" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
