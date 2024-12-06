import express from "express";
import { db } from "../config/sqldb";
import multer from "multer";
import path from "path";
import { products } from "../types";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/packs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), (req, res) => {
  let { reference, name, price, productReferences } = req.body;
  productReferences = JSON.parse(productReferences);

  let profilePictureUrl = null;
  if (req.file) {
    profilePictureUrl = `/uploads/packs/${req.file.filename}`;
  }

  const query =
    "INSERT INTO packs (reference, name, price, image) VALUES (?, ?, ?, ?)";

  const queryProducts =
    "INSERT INTO pack_products (packReference, productReference, quantity) VALUES ?";

  db.query(
    query,
    [reference, name, price, profilePictureUrl],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      const packReference = reference;

      const values = productReferences.map((product: products) => [
        packReference,
        product.reference,
        product.quantity,
      ]);

      db.query(queryProducts, [values], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }

        res.status(201).json({
          success: true,
        });
      });
    }
  );
});

// router.post("/:packReference/products", (req, res) => {
//   const { packReference } = req.params;
//   const { productReferences } = req.body;

//   const query =
//     "INSERT INTO pack_products (packReference, productReference) VALUES ?";
//   const values = productReferences.map((productReference: string) => [
//     packReference,
//     productReference,
//   ]);

//   db.query(query, [values], (err, result) => {
//     if (err) {
//       res.status(500).json({ success: false });
//     } else {
//       res.status(201).json({
//         success: true,
//       });
//     }
//   });
// });

router.get("/getWithProducts/:reference", (req, res) => {
  const { reference } = req.params;

  const query = `
    SELECT 
      p.reference AS packReference,
      p.name AS packName,
      p.price AS packPrice,
      p.image AS packImage,
      pp.quantity AS productQuantity,
      pr.reference AS productReference,
      pr.name AS productName,
      pr.boughtPrice AS productBoughtPrice,
      pr.sellPrice AS productSellPrice,
      f.name AS familyName
    FROM 
      packs p
    JOIN 
      pack_products pp ON p.reference = pp.packReference
    JOIN 
      products pr ON pp.productReference = pr.reference
    LEFT JOIN 
      families f ON pr.familyId = f.reference
    WHERE 
      p.reference = ?
  `;

  db.query(query, [reference], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.status(200).json({ success: true, data: result });
  });
});

router.get("/getProductsOfPack/:reference", (req, res) => {
  const { reference } = req.params;

  const query = `
    SELECT 
      pp.quantity AS quantity,
      pr.reference AS reference,
      pr.name AS name,
      pr.boughtPrice AS boughtPrice,
      pr.sellPrice AS sellPrice,
      pr.image AS image
    FROM 
      packs p
    JOIN 
      pack_products pp ON p.reference = pp.packReference
    JOIN 
      products pr ON pp.productReference = pr.reference
    LEFT JOIN 
      families f ON pr.familyId = f.reference
    WHERE 
      p.reference = ?
  `;

  db.query(query, [reference], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.status(200).json({ success: true, data: result });
  });
});

router.put("/edit", (req, res) => {
  let { reference, name, price, productReferences } = req.body;
  productReferences = JSON.parse(productReferences);

  const query = "UPDATE packs SET name=?, price=?";

  const deleteQuery = "DELETE FROM pack_products WHERE packReference = ?";

  const queryProducts =
    "INSERT INTO pack_products (packReference, productReference, quantity) VALUES ?";

  db.query(query, [name, price], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const packReference = reference;

    db.query(deleteQuery, [packReference], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      const values = productReferences.map((product: products) => [
        packReference,
        product.reference,
        product.quantity,
      ]);

      db.query(queryProducts, [values], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }

        res.status(201).json({
          success: true,
        });
      });
    });
  });
});

export const packsRoutes = router;
