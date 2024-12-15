import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./src/routes/auth";
import { tableRoutes } from "./src/routes/table";
import multer from "multer";
import path from "path";
import { productsRoutes } from "./src/routes/products";
import { familiesRoutes } from "./src/routes/families";
import { packsRoutes } from "./src/routes/packs";
import { clientsRoutes } from "./src/routes/clients";
import { fournisseursRoutes } from "./src/routes/fournisseurs";
import { delivery_notesRoutes } from "./src/routes/delivery_notes";
import { stockRoutes } from "./src/routes/stock";
import { retour_client_notesRoutes } from "./src/routes/retour_client_notes";
import { usersRoutes } from "./src/routes/users";
import { agenciesRoutes } from "./src/routes/agencies";
import { ordersRoutes } from "./src/routes/order";
import webPush from "web-push";
import bodyParser from "body-parser";
import { db } from "./src/config/sqldb";
import session from "express-session";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "saphirwebbackendsecretkey2029",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
    },
  })
);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const VAPID_PUBLIC_KEY =
  "BNpyBg350PH9VwmvUAmoJboV7ZaMH044BRelTiw3buFKyJr9QnhBLOF_54lIzPlEEK8JK6HKERdUSriDFH8VA44";
const VAPID_PRIVATE_KEY = "Co6NZs5gZrIOXFtOD0rMMWhEp8rik7l8j95DY2i46_4";

webPush.setVapidDetails(
  "mailto:ezakaryaelx@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

app.use(bodyParser.json());

// export const upload = multer({ storage: storage });

app.use("/auth", authRoutes);
app.use("/table", tableRoutes);
app.use("/families", familiesRoutes);
app.use("/packs", packsRoutes);
app.use("/products", productsRoutes);
app.use("/clients", clientsRoutes);
app.use("/fournisseurs", fournisseursRoutes);
app.use("/stock", stockRoutes);
app.use("/delivery_notes", delivery_notesRoutes);
app.use("/retour_client_notes", retour_client_notesRoutes);
app.use("/users", usersRoutes);
app.use("/agencies", agenciesRoutes);
app.use("/orders", ordersRoutes);

// app.get("/uploads/*", (req: any, res) => {
//   res.sendFile(path.join(__dirname, "../uploads", req.params[0]));
// });

app.post("/api/save-subscription", async (req: any, res: any) => {
  const { userId, subscription } = req.body;

  if (!subscription || !userId) {
    return res.status(400).json({ message: "Missing subscription or userId" });
  }

  db.query(
    `INSERT INTO subscriptions (user_id, endpoint, auth, p256dh) VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE endpoint = VALUES(endpoint), auth = VALUES(auth), p256dh = VALUES(p256dh)`,
    [
      userId,
      subscription.endpoint,
      subscription.keys.auth,
      subscription.keys.p256dh,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Error saving subscription" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Subscription saved" });
    }
  );
});

app.post("/api/send-notification", async (req: any, res: any) => {
  const { userId, payload } = req.body;

  db.query(
    "SELECT * FROM users WHERE reference = ?",
    [userId],
    (err, results: any) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending notification" });
      } else {
        try {
          db.query(
            `SELECT endpoint, auth, p256dh FROM subscriptions WHERE user_id = ?`,
            [userId],
            async (err, rows: any) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Error fetching subscription" });
              }

              if (!rows || rows.length === 0) {
                return res
                  .status(404)
                  .json({ message: "No subscription found for this user" });
              }

              const subscription = {
                endpoint: rows[0].endpoint,
                keys: {
                  auth: rows[0].auth,
                  p256dh: rows[0].p256dh,
                },
              };

              await webPush.sendNotification(
                subscription,
                JSON.stringify({
                  ...payload,
                  title: `${results[0].fname}, ${payload.title}`,
                })
              );
              res.status(200).json({ message: "Notification sent" });
            }
          );
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Notification error" });
        }
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Hello, Vercel with Redis and TypeScript!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
