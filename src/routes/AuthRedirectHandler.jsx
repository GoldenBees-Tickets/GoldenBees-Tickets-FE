// src/components/AuthRedirectHandler.jsx
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authEvents } from "@/utils/authEventBus";

const AuthRedirectHandler = () => {
    const navigate = useNavigate();

  useEffect(() => {
    authEvents.onUnauthorized = () => {
      navigate("/login", { replace: true });
    };
    authEvents.onForbidden = () => {
        navigate("/permission-denied-page", { replace: true });
    }
  }, [Navigate]);

  return null; // không render gì
};

export default AuthRedirectHandler;
