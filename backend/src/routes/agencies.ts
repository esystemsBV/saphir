import express, { query } from "express";
import { db } from "../config/sqldb";

const router = express.Router();

router.get("/", (req, res) => {
  const q = `
    SELECT 
      a.*,
      CONCAT(u.fname, ' ', u.lname) AS responsible
    FROM 
      agencies a
    LEFT JOIN users u ON a.responsible = u.reference
  `;

  db.query(q, (err, results) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true, data: results });
  });
});

router.post("/add", (req, res) => {
  const { location, name, phone, responsible } = req.body;
  const q =
    "INSERT INTO agencies (location, name, phone, responsible) VALUES (?, ?, ?, ?)";
  db.query(q, [location, name, phone, responsible], (err, results) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true });
  });
});

router.put("/edit", (req, res) => {
  const { reference, location, name, phone, responsible } = req.body;

  const q = `UPDATE agencies SET location=?, name=?, phone=?, responsible=? WHERE reference=${reference}`;
  db.query(q, [location, name, phone, responsible], (err, results) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true });
  });
});

export const agenciesRoutes = router;
