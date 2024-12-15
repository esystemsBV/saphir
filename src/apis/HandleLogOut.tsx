import { def } from "@/data/Links";
import axios from "axios";

export const handleLogOut = async () => {
  try {
    const response = await axios.post(`${def}/auth/logout`, {
      token: localStorage.getItem("authToken"),
    });
    if (response.data.success) {
      window.location.reload();
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("An error occurred during logout");
  }
};
