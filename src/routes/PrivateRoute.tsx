// src/routes/PrivateRoute.tsx
import React from "react"; // 👈 NECESARIO
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}
