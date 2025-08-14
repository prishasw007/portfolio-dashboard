import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const onLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/Auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Optional: get role from server
        const data = await response.json();

        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return <Login onLogin={onLogin} />;
};

export default LoginPage;
