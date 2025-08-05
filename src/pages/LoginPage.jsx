import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  const onLogin = async (email, password) => {
    // TEMPORARY: No API call, just log in instantly
    console.log("Logging in with:", email, password);

    // Optionally store fake token or user info
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("userEmail", email);

    // Redirect to dashboard
    navigate("/dashboard");
  };

  return <Login onLogin={onLogin} />;
};

export default LoginPage;

