import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { tableRoutes } from "./routes/table";
import multer from "multer";
import path from "path";
import { productsRoutes } from "./routes/products";
import { familiesRoutes } from "./routes/families";
import { packsRoutes } from "./routes/packs";
import { clientsRoutes } from "./routes/clients";
import { fournisseursRoutes } from "./routes/fournisseurs";
import { delivery_notesRoutes } from "./routes/delivery_notes";
import { stockRoutes } from "./routes/stock";
import { retour_client_notesRoutes } from "./routes/retour_client_notes";
import { usersRoutes } from "./routes/users";
import { agenciesRoutes } from "./routes/agencies";
import { ordersRoutes } from "./routes/order";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  session({
    secret: "saphirwebbackendsecretkey2029",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

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

app.get("/uploads/*", (req: any, res) => {
  res.sendFile(path.join(__dirname, "../uploads", req.params[0]));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
