import express from "express";
import { db } from "../config/sqldb";
import { ResultSetHeader } from "mysql2";

const router = express.Router();

router.post("/add", (req, res) => {
  const {
    address,
    fname,
    lname,
    phone,
    company_rc,
    company_if,
    company_tp,
    company_ice,
    type,
  } = req.body;

  const query =
    "INSERT INTO fournisseurs (address, fname, lname, phone, company_rc, company_if, company_tp, company_ice, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      address,
      fname,
      lname,
      phone,
      company_rc,
      company_if,
      company_tp,
      company_ice,
      type,
    ],
    (err, result) => {
      if (err) {
        res.json({ success: false, error: err });
      } else {
        res.json({ success: true });
      }
    }
  );
});

router.put("/edit", (req, res) => {
  const {
    address,
    fname,
    lname,
    phone,
    company_rc,
    company_if,
    company_tp,
    company_ice,
    type,
    reference,
  } = req.body;

  const query =
    "UPDATE fournisseurs SET address=?, fname=?, lname=?, phone=?, company_rc=?, company_if=?, company_tp=?, company_ice=?, type=? WHERE reference=?";

  db.query(
    query,
    [
      address,
      fname,
      lname,
      phone,
      company_rc,
      company_if,
      company_tp,
      company_ice,
      type,
      reference,
    ],
    (err, result: ResultSetHeader) => {
      if (err || result.affectedRows === 0) {
        res.json({ success: false, error: err });
      } else {
        res.json({ success: true });
      }
    }
  );
});
export const fournisseursRoutes = router;
