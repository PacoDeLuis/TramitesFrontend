import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { colors } from "../styles/theme";
import React from "react";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: colors.background,
    boxSizing: "border-box"
  };

  const headerStyle: React.CSSProperties = {
    background: colors.greenDark,
    color: "white",
    padding: "14px clamp(15px, 5vw, 30px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    flexWrap: "wrap", // Permite que el botón baje en pantallas muy pequeñas
    gap: "15px"
  };

  const logoBoxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: "1 1 auto"
  };

  const logoStyle: React.CSSProperties = {
    width: "42px",
    height: "42px",
    objectFit: "contain"
  };

  const logoTextStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(14px, 4vw, 18px)", // Tamaño de fuente fluido
    fontWeight: 600
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "10px",
    opacity: 0.9
  };

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box"
  };

  const loginBoxStyle: React.CSSProperties = {
    background: colors.white,
    padding: "clamp(20px, 8vw, 50px)", // Menos padding en móvil
    borderRadius: "28px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box"
  };

  const buttonStyle: React.CSSProperties = {
    background: colors.greenPrimary,
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap"
  };

  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "14px",
    color: "#777",
    fontSize: "13px"
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={logoBoxStyle}>
          <img src={logo} alt="Logo" style={logoStyle} />
          <div style={logoTextStyle}>
            <span style={titleStyle}>AYUNTAMIENTO DE HUAMANTLA</span>
            <small style={subtitleStyle}>
              SISTEMA DE TRÁMITES Y SERVICIOS
            </small>
          </div>
        </div>

        <button style={buttonStyle} onClick={() => navigate("/consulta")}>
          Consultar trámite
        </button>
      </header>

      <div style={containerStyle}>
        <div style={loginBoxStyle}>
          <Login />
        </div>
      </div>

      <footer style={footerStyle}>
        © {new Date().getFullYear()} Ayuntamiento de Huamantla
      </footer>
    </div>
  );
}