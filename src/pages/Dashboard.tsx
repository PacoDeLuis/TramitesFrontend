import React from "react";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/theme";

export default function Dashboard() {
  const { rol, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: colors.background,
        color: colors.greenPrimary,
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
        Bienvenido al sistema
      </h1>
      
    </div>
  );
}
