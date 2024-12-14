import { useUser } from "@/hooks/useUserContext";
import React, { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY =
  "BNpyBg350PH9VwmvUAmoJboV7ZaMH044BRelTiw3buFKyJr9QnhBLOF_54lIzPlEEK8JK6HKERdUSriDFH8VA44";

export const Notifications: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );
  const { user } = useUser();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          })
          .then(async (subscription) => {
            await fetch("http://localhost:5174/api/save-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user?.reference,
                subscription,
              }),
            });
          })
          .catch((error) => console.error("Subscription error:", error));
      });
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const askForPermission = async () => {
    if ("Notification" in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === "granted") {
          console.log("Notification permission granted.");
          new Notification("Thank you for enabling notifications!");
        } else if (result === "denied") {
          console.warn("Notification permission denied.");
        } else {
          console.log("Notification permission dismissed.");
        }
      } catch (error) {
        console.error("Failed to request notification permission:", error);
      }
    } else {
      console.error("Notifications are not supported by your browser.");
    }
  };

  return (
    <div>
      <div>
        <p>Current Notification Permission: {permission}</p>
        {permission !== "granted" && (
          <button onClick={askForPermission}>Enable Notifications</button>
        )}
      </div>
    </div>
  );
};
