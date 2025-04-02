import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si es primer login (puedes ajustar esta lógica)
  if (userData.isFirstLogin === false) {
    return <Navigate to="/Registro" replace />;
  }

  return children;
};

export default ProtectedRoute;