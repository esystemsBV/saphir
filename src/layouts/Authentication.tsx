import React, { useEffect, useState } from "react";
import Login from "../pages/Login";
import { useUser } from "../hooks/useUserContext";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import { users } from "../lib/database";
import { def } from "@/data/Links";
import LoadingLogo from "@/components/others/LoadingLogo";

const AuthenticationLayout: React.FC = () => {
  const { setUser } = useUser();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${def}/auth/check`, {
          withCredentials: true,
          withXSRFToken: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setAuthenticated(response.data.isAuthenticated);
        setUser(response.data.user as users);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  if (loading) {
    return <LoadingLogo />;
  }

  return <>{authenticated ? <Outlet /> : <Login />}</>;
};

export default AuthenticationLayout;
