import express from "express";
import { db } from "../config/sqldb";
const router = express.Router();

router.post("/add", (req, res) => {
  const { products } = req.body;

  products.map((product: any) => {
    const { reference, stock, type, difference } = product;

    const stockQuery = `    
    UPDATE stock 
    SET quantity = ?
    WHERE product_id = ?`;

    const stockData = [stock, reference];

    const transactionsq = `INSERT INTO transactions (product_id, transaction_type, quantity, source, transaction_date) VALUES (?, ?, ?, ?, ?)`;

    const transactionData = [
      reference,
      type,
      difference,
      "stockadd",
      new Date(),
    ];

    db.query(stockQuery, stockData, (err, result) => {
      if (err) return res.json({ success: false, error: err });
      else {
        db.query(transactionsq, transactionData, (err, result) => {
          if (err) return res.json({ success: false, error: err });
          else res.json({ success: true, error: err });
        });
      }
    });
  });
});

export const stockRoutes = router;
