import React from "react";
import { colors } from "../styles/theme";
import logo from "../assets/logo.png";
import LogoutButton from "./LogoutButton";

interface HeaderProps {
  onOpenMenu?: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const headerStyle: React.CSSProperties = {
    background: colors.white,
    padding: "8px 12px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: "5px"
  };

  return (
    <header style={headerStyle} className="header-container">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
        <button 
          className="mobile-menu-btn" 
          onClick={onOpenMenu}
          style={{
            background: colors.greenPrimary,
            border: "none",
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            color: "white",
            display: "none", 
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            padding: 0
          }}
        >
          ☰
        </button>

        <img src={logo} alt="Logo" style={{ height: "24px", width: "auto", flexShrink: 0 }} />
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="header-title" style={{ 
            color: colors.greenDark, 
            fontWeight: 700, 
            fontSize: "12px",
            lineHeight: "1.1",
            display: "block"
          }}>
            SISTEMA DE TRÁMITES Y SERVICIOS
          </span>
        </div>
      </div>

      <div className="header-actions">
        <LogoutButton />
      </div>
    </header>
  );
}