import { createRoot } from "react-dom/client";
import App from "./main/App.tsx";
import "./css/index.css";
import "./lib/i18n.ts";

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
  }
});

createRoot(document.getElementById("root")!).render(<App />);
