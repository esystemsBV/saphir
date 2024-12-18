import { createRoot } from "react-dom/client";
import App from "./main/App.tsx";
import "./css/index.css";
import "./main/i18n.js";
import { NextUIProvider } from "@nextui-org/react";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
);
