import express from "express";
import { db } from "../config/sqldb";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), (req, res) => {
  const { reference, familyId, name, boughtPrice, sellPrice, stock } = req.body;

  let profilePictureUrl = null;
  if (req.file) {
    profilePictureUrl = `/uploads/products/${req.file.filename}`;
  }

  const query =
    "INSERT INTO products (reference, familyId, image, name, boughtPrice, sellPrice) VALUES (?, ?, ?, ?, ?, ?);";
  const q2 = "INSERT INTO stock (product_id, quantity) VALUES (?, ?);";
  const q3 =
    "INSERT INTO transactions (product_id, transaction_type, quantity, source) VALUES (?, ?, ?, ?);";

  db.query(
    query,
    [
      reference,
      familyId,
      profilePictureUrl,
      name,
      +boughtPrice,
      +sellPrice,
      reference,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({ success: false, error: err });
      } else {
        db.query(q2, [+reference, +stock], (err, result) => {
          if (err) {
            res.status(500).json({ success: false, error: err });
          } else {
            db.query(
              q3,
              [+reference, "up", +stock, "initial"],
              (err, result) => {
                if (err) {
                  res.status(500).json({ success: false, error: err });
                }
                res.status(201).json({ success: true });
              }
            );
          }
        });
      }
    }
  );
});

router.put("/edit", (req, res) => {
  const { reference, name, boughtPrice, sellPrice } = req.body;
  const query = `UPDATE products
              SET name=?, boughtPrice=?, sellPrice=?
              WHERE reference=?`;

  db.query(query, [name, boughtPrice, sellPrice, reference], (err, result) => {
    if (err) {
      res.json({ success: false, error: err });
    } else {
      res.json({ success: true });
    }
  });
});

// get products by familyReference
router.get("/byfamilyref/:reference", (req, res) => {
  const { reference } = req.params;

  const query = `SELECT 
      products.*, 
      families.name AS familyName,
      stock.quantity AS stock
    FROM products
    LEFT JOIN families ON products.familyId = families.reference
    LEFT JOIN stock ON products.reference = stock.product_id
    WHERE 
    products.familyId = ?;
    `;

  db.query(query, reference, (err, result) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      res.status(201).json({
        success: true,
        data: result,
      });
    }
  });
});

// get products with familiesName
router.get("/withfamilyname", (req, res) => {
  const query = `
    SELECT 
      products.*, 
      families.name AS familyName, 
      stock.quantity AS stock
    FROM products
    LEFT JOIN families ON products.familyId = families.reference
    LEFT JOIN stock ON products.reference = stock.product_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  });
});

// get products by it's reference
router.get("/byreference/:reference", (req, res) => {
  const { reference } = req.params;

  const query = `
    SELECT 
      products.*, 
      families.name AS familyName, 
      stock.quantity AS stock,
      transactions.transaction_type AS transactionType,
      transactions.source AS transactionSource,
      transactions.quantity AS transactionQuantity,
      transactions.transaction_date AS transactionDate
    FROM products
    LEFT JOIN families ON products.familyId = families.reference
    LEFT JOIN stock ON products.reference = stock.product_id
    LEFT JOIN transactions ON products.reference = transactions.product_id
    WHERE products.reference = ?
    ORDER BY transactions.transaction_date DESC;
  `;

  db.query(query, [reference], (err, results: any) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const product = {
      reference: results[0].reference,
      name: results[0].name,
      familyId: results[0].familyId,
      familyName: results[0].familyName,
      boughtPrice: results[0].boughtPrice,
      sellPrice: results[0].sellPrice,
      image: results[0].image,
      stock: results[0].stock,
      transactions: results.map((row: any) => ({
        type: row.transactionType,
        source: row.transactionSource,
        quantity: row.transactionQuantity,
        date: row.transactionDate,
        provider: row.transactionDate,
      })),
    };

    res.status(200).json({
      success: true,
      data: product,
    });
  });
});

export const productsRoutes = router;
