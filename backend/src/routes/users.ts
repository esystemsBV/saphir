import express from "express";
import { db } from "../config/sqldb";
import { users } from "../types";

const router = express.Router();

router.get("/fetch/:type", (req, res) => {
  const type = req.params.type;

  const q = `SELECT * FROM users WHERE role = '${type}'`;
  db.query(q, (err, results) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true, data: results });
  });
});

router.post("/add", (req, res) => {
  const { fname, lname, phone, email, role, password }: users = req.body;
  const q =
    "INSERT INTO users (fname, lname, phone, email, role, password) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(q, [fname, lname, phone, email, role, password], (err, results) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true });
  });
});

router.put("/edit", (req, res) => {
  const { reference, fname, lname, phone, email, role, password }: users =
    req.body;

  const q = `UPDATE users SET fname=?, lname=?, phone=?, email=?, role=?, password=? WHERE reference=${reference}`;
  db.query(q, [fname, lname, phone, email, role, password], (err, results) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true });
  });
});

export const usersRoutes = router;
