import express from "express";
import { db } from "../config/sqldb";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/families/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), (req, res) => {
  const { reference, name } = req.body;
  const query =
    "INSERT INTO families (reference, name, image) VALUES (?, ?, ?)";

  let profilePictureUrl = null;
  if (req.file) {
    profilePictureUrl = `/uploads/families/${req.file.filename}`;
  }

  db.query(query, [reference, name, profilePictureUrl], (err, result) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      res.status(201).json({ success: true });
    }
  });
});

router.put("/edit", (req, res) => {
  const { reference, name } = req.body;
  const query = "UPDATE families SET name=? WHERE reference=?";

  db.query(query, [name, reference], (err, result) => {
    if (err) {
      res.json({ success: false, error: err });
    } else {
      res.json({ success: true });
    }
  });
});

export const familiesRoutes = router;
