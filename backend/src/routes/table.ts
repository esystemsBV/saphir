import express from "express";
import { db } from "../config/sqldb";
import { users } from "../types";
import { ResultSetHeader } from "mysql2";

const router = express.Router();

router.get("/fetch/:table", (req, res) => {
  const table = req.params.table;
  const oneRow = table === "profile";
  const query = `SELECT * FROM \`${table}\``;

  db.query(query, (err, results: any) => {
    if (err) return res.status(500).json({ message: "db-error", error: err });
    if (results.length === 0) return res.json([] as users[]);

    if (oneRow) return res.json(results[0] as users);
    return res.json(results as users[]);
  });
});

router.delete("/delete/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const query = `DELETE FROM ${table} WHERE reference = ?`;

  db.query(query, [id], (err, results: ResultSetHeader) => {
    if (err) return res.status(500).json({ message: "db-error", error: err });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "error-deleting" });
    return res.json({ message: "deleted-success" });
  });
});

export const tableRoutes = router;
