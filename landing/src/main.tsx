import { createRoot } from "react-dom/client";
import App from "./main/App.tsx";
import "./css/index.css";
import "./lib/i18n.ts";

createRoot(document.getElementById("root")!).render(<App />);
