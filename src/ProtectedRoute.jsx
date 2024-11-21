import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isFirstLogin = localStorage.getItem("isFirstLogin");
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isFirstLogin) {
    return <Navigate to="/Registro" replace />;
  }

  // Pasar el userId como prop si es necesario
  console.log(userId)
  return React.cloneElement(children, { userId });
};

export default ProtectedRoute;
