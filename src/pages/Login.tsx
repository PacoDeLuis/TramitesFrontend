import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/theme";
import React from "react";
import logo from "../assets/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  /* ESTILOS RESPONSIVOS */

  const cardStyle: React.CSSProperties = {
    background: colors.white,
    width: "100%",
    // "clamp" permite que el padding sea menor en móviles y crezca en PC
    padding: "clamp(20px, 8vw, 36px) clamp(20px, 8vw, 34px)",
    borderRadius: "22px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
    textAlign: "center",
    boxSizing: "border-box" // Crucial para que el padding no sume al ancho total
  };

  const logoStyle: React.CSSProperties = {
    width: "clamp(70px, 15vw, 90px)", // Logo más pequeño en pantallas minúsculas
    marginBottom: "18px"
  };

  const groupStyle: React.CSSProperties = {
    marginBottom: "16px",
    textAlign: "left"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#333"
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    marginTop: "6px",
    // 16px de font-size evita el zoom automático molesto en iPhones
    fontSize: "16px", 
    outline: "none",
    boxSizing: "border-box"
  };

  const passwordWrapper: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%"
  };

  const toggleStyle: React.CSSProperties = {
    cursor: "pointer",
    color: colors.blue,
    fontSize: "13px",
    userSelect: "none",
    whiteSpace: "nowrap",
    fontWeight: 500
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    background: colors.greenPrimary,
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    marginTop: "8px",
    transition: "opacity 0.2s"
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "14px",
    color: "#c62828",
    textAlign: "center",
    fontSize: "13px"
  };

  async function login() {
    setError("");
    try {
      const res = await api.post("/login/", {
        username: username.trim(),
        password
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("rol", res.data.rol);
      localStorage.setItem("username", res.data.username);

      authLogin(res.data.access, res.data.rol);
      navigate("/dashboard");
    } catch {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <div style={cardStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />

      <div style={groupStyle}>
        <label style={labelStyle}>Usuario</label>
        <input
          style={inputStyle}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Ingrese su usuario"
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Contraseña</label>
        <div style={passwordWrapper}>
          <input
            style={inputStyle}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <span
            style={toggleStyle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </span>
        </div>
      </div>

      <button style={buttonStyle} onClick={login}>
        Entrar al sistema
      </button>

      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}