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
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

interface ContactRow {
  Nom: string;
  Email: string;
  Téléphone: string;
  Message: string;
  Date: string;
}

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "saphirwebbackendsecretkey2029",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
  })
);

app.use(
  cors({
    origin: ["https://saphirweb.ma", "https://dashboard.saphirweb.ma"],
    methods: ["GET", "POST", "PUT", "DELETE"],
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

app.post("/api/google-sheets", async (req: any, res: any) => {
  const { email, message, nom, telephone } = req.body;

  try {
    const serviceAccountAuth = new JWT({
      email: "ezakaryae@emenu-f49d7.iam.gserviceaccount.com",
      key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC83huCOylfmQZC\n5e/ZHElaGMdj8LAiCOdDk9hvOrDiBRqPiHLTbOWyKNvYq6tXYEEfE8O/c1I5WsQm\nelOcnWovcqgCXdiCrO9iE1TfMdIBTr4exs+5Hzbd8Gp8Ae0oRTn29s5iKSUT0az1\nRXvkG19ddYEpcNfUOyLu+R66w2Xxv51hImS1xgM4Ujvt9uYcdfgL8gh6dw/uglsF\nlefIVeawFAugd7HyiUSBhU4fw0vT4Sc5cHz7Sbcj09Y3EldUO75odCw0IGNhJT1I\nv6+oV2giqe143wA4K/fwQNJWVpLB7UgsHnhiox7E49J7dkKtV7KVLKYXKksL3LIn\nTVpHK+LZAgMBAAECggEAEdEoKjB3ljei4hO7/TDQcKnuwWxWyVcqrfLYE6InRqMx\nnsHCB1T6FEULfFSxjMQdUJe2OyzfYF7CK1kV4yvsdP5tgA+nWaiDyq5FLusNwybR\nA6lAtleN/wDrorgxzb8+GSCuVo9IGqcImHjOF7ZHWFM59JVbHv/XK1EgB4FgcB44\nPFj/xRZouRQ1pDN+Inf7M4A83i71fRitRLnNVw9LkldXOY8zI0qsQbJ2ARf5DXaU\nG5F+cm3EuVNKe1JnyuZSpFLW9lVBSK1PpFLzrWGgya+/aC+j6pr1iNA8UvPKgEfE\nXYNKPzq1bgSRjQSCfeSAxadkPR68vblfqtEWY68tqwKBgQD0UhM1tXSdJ5nIwkI4\nHKfxTf8aPoB1Y3Ed8T6jSBIfWTJ1kCBsVhn7N9EiRkZQmAaTjaxhiYHZr8oPxEWG\n75f50svpf7dq+vFMgrShPR19xiLXPUiqLNgGW2r5jh8euOCH7gDcJ6NFgXh51xjS\nU0t8GHUUqpNFeR6IyadkD5imWwKBgQDF5WomfQy7klk5k7cRQP7hOlFoFAM0fi7P\nFdQg1Z6+rfwgHpva0n/oxeqXu9dzNrwOim3VrTDt8z2QGMkVKGh95X25OcYMgVdk\ngEn0LHC1/S+m1FYhSAPrIZvPFcR89KVJ/ifjoumgi/xKECqHQQRr5V3yVlWlQvzg\nlbP9g6Mp2wKBgQChsohALZ3GPOVMtzR4So7j50kEp4UBLBU7SeS40AQedzwsDn1G\n9h0v5Jsm4fe7c0I2+bayvv0Pg4ZptO6HBZ9Bmj+WhA5yYS6+AmtlozsXeMCqT0b+\nSbuXSX2dOHBkNttzWxN6oUkvwSZpDPDCkpoMwWsLiHD7s9N/mGaOlLvkrQKBgAKo\nQfSiWTlrjacoRJ0GsmVz0wQCwMhDqX0+XcrTE36b93a28oDNssn9XlkLPKlfYscP\nNMpZuP549aqpqomOMVj/a+DA1df1JKdE0blln13SOIGU+FMaFHNj0CPHtwu2fUGx\nF/gGh/yP5KNZ9Dg8t0J7ofdPEXdWnu6lE/Wjft1hAoGAYmIhN2cAEuum9RXzVucM\n0g+DuaqWomK8Svgy0ayA7cz5RaR8s8HFwHf8oNvZa7MFpFmJ+sz5svxRHvLC9I32\n82KihYL9e49liRuj8YIzyIZFwwO5ZBi4Ajyn2WLtMH3XZbWy0fpfwm90Qjy0Egxx\nGfPoSSGta1LVw1QEQWst/Pk=\n-----END PRIVATE KEY-----\n"?.replace(
        /\\n/g,
        "\n"
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      "1y_N1IW1vNREyeJ9RSZixp_rCJe6fUMYv-_BBQSKDVyw"!,
      serviceAccountAuth
    );
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    const rowData: ContactRow = {
      Nom: nom || "",
      Email: email || "",
      Téléphone: telephone || "",
      Message: message || "",
      Date: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
    };

    await sheet.addRow(rowData as any);

    return res.json({
      success: true,
      message: "Message envoyé avec sucèes, Merci!",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error submitting form",
      err: error,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, Vercel with Redis and TypeScript!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
