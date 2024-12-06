import express from "express";
import { db } from "../config/sqldb";
import { ResultSetHeader } from "mysql2";
const router = express.Router();

router.post("/add", (req, res) => {
  const { reference, quantity, type } = req.body;

  const stockQuery = `    
    UPDATE stock 
    SET quantity = ?
    WHERE product_id = ?`;

  const transactionsq = `INSERT INTO transactions (product_id, transaction_type, quantity, source, transaction_date) VALUES (?, ?, ?, ?, ?)`;

  const stockData = [quantity, reference];
  const transactionData = [reference, type, quantity, "stockadd", new Date()];

  db.query(stockQuery, stockData, (err, result) => {
    if (err) return res.json({ success: false, error: err });
    else {
      db.query(transactionsq, transactionData, (err, result) => {
        if (err) return res.json({ success: false, error: err });

        res.json({ success: true, error: err });
      });
    }
  });
});

export const stockRoutes = router;
