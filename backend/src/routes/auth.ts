import express from "express";
import { db } from "../config/sqldb";
import { CustomSession, users } from "../types";
import { ResultSetHeader } from "mysql2";
const router = express.Router();
import { customAlphabet } from "nanoid";

const JWT_SECRET = "SAPHIRwebSECRETKEY2024";

router.post("/check", (req, res: any) => {
  const session = req.session as CustomSession;
  const { token } = req.body;

  db.query(
    "SELECT * FROM logins WHERE token = ?",
    [token],
    (err, results: any) => {
      if (err) {
        return res.status(500).json({
          isAuthenticated: false,
          message: "error-support-message",
          err: err,
        });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ isAuthenticated: false, message: "wrong-password" });
      }

      const user = JSON.parse(results[0].user);

      return res.json({
        isAuthenticated: true,
        user: user,
      });
    }
  );
});

router.post("/login", (req, res) => {
  const referenceInDo = customAlphabet("1234567890", 5);
  const referenceX = referenceInDo();
  const token = `${referenceX}-${JWT_SECRET}`;

  const { password, email } = req.body;
  const query =
    "SELECT fname, lname, banned, reference, role FROM users WHERE password = ? and email = ?";

  db.query(query, [password, email], (err, results: any[]) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "error-support-message", err: err });
    if (results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "wrong-password" });

    if (results[0].banned)
      return res.status(404).json({ success: false, message: "user-banned" });

    const user = {
      fname: results[0].fname,
      lname: results[0].lname,
      role: results[0].role,
      reference: results[0].reference,
    };
    db.query(
      "INSERT INTO logins (user, token) VALUES (?, ?)",
      [JSON.stringify(user), token],
      (err) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: "error-support-message",
            err: err,
          });

        return res.json({
          success: true,
          message: "login-success",
          user: user,
          token,
        });
      }
    );
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

router.post("/logout", (req, res) => {
  const { token } = req.body;
  db.query("DELETE FROM logins WHERE token = ?", [token], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "error-support-message",
        err: err,
      });
    }
    return res.json({ success: true, message: "logout-success" });
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
