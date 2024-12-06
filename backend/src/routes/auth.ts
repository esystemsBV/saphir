import express from "express";
import { db } from "../config/sqldb";
import { CustomSession, users } from "../types";
import { ResultSetHeader } from "mysql2";

const router = express.Router();

router.get("/check", (req, res: any) => {
  const session = req.session as CustomSession;

  if (session.user) {
    return res.json({ isAuthenticated: true, user: session.user });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

router.post("/login", (req, res) => {
  const pass = req.body.password;
  const query = "SELECT name, role FROM users WHERE password = ?";

  db.query(query, [pass], (err, results: any[]) => {
    if (err) return res.status(500).json({ message: "error-support-message" });
    if (results.length === 0)
      return res.status(404).json({ message: "wrong-password" });

    const session = req.session as CustomSession;
    session.user = { name: results[0].name, role: results[0].role };
    return res.json({ message: "login-success", user: session.user });
  });
});

router.post("/register", (req, res: any) => {
  const { fname, password, role }: users = req.body;

  if (!fname || !password || !role) {
    return res.status(400).send("missing-fields");
  }

  const query1 = "SELECT * FROM users WHERE password=?";

  db.query(query1, [password], (err, result: any[]) => {
    if (err) return res.status(500).send("error-creating-user");

    if (result.length > 0) {
      return res.status(404).send("error-creating-user");
    } else {
      const query =
        "INSERT INTO users (fname, password, role) VALUES (?, ?, ?)";
      db.query(query, [fname, password, role], (err) => {
        if (err) return res.status(500).send("error-creating-user");
        return res.status(201).send("user-registered");
      });
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("error-logging-out");
    res.clearCookie("connect.sid");
    return res.json({ message: "logout-success", success: true });
  });
});
router.put("/update", (req: any, res: any) => {
  const { id, name, password, role } = req.body;

  if (!id || !name || !password || !role) {
    return res.status(400).json({ error: "fill-in-inputs" });
  }

  const query =
    "UPDATE users SET name = ?, password = ?, role = ? WHERE id = ?";
  db.query(
    query,
    [name, password, role, id],
    (error, results: ResultSetHeader) => {
      if (error) {
        return res.json({ error: "Database error: " + error.message });
      }

      if (results.affectedRows === 0) {
        return res.json({ error: "No user found with the given ID" });
      }

      return res.json({
        success: true,
        message: "user history updated successfully",
      });
    }
  );
});

export const authRoutes = router;
