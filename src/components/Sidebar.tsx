import { Link, useLocation } from "react-router-dom";
import { colors } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import logo from "../assets/logo.png";

// 1. Definimos que el componente puede recibir la función onClose
interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { rol } = useAuth();
  const location = useLocation();

  const sidebarStyle: React.CSSProperties = {
    width: "230px",
    background: colors.greenPrimary,
    color: "white",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    boxShadow: "3px 0 12px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease-in-out",
  };

  // 2. NavItem ahora usa la función onClose al hacer clic
  function NavItem({ to, children, icon }: { to: string; children: React.ReactNode; icon: string }) {
    const isActive = location.pathname === to;
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link
        to={to}
        onClick={onClose} // 👈 Esto cierra el menú en móvil al navegar
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          color: "white",
          textDecoration: "none",
          padding: "10px 14px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "14px",
          fontWeight: isActive ? "600" : "400",
          transition: "all 0.2s ease",
          background: isActive 
            ? "rgba(255,255,255,0.22)" 
            : isHovered 
              ? "rgba(255,255,255,0.12)" 
              : "transparent",
        }}
      >
        <span style={{ fontSize: "17px" }}>{icon}</span>
        {children}
      </Link>
    );
  }

  return (
    <aside style={sidebarStyle} className="sidebar-content">
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img 
          src={logo} 
          alt="Logo Huamantla" 
          style={{ 
            width: "85px", 
            marginBottom: "8px",
            filter: "drop-shadow(0px 3px 3px rgba(0,0,0,0.2))" 
          }} 
        />
        <p style={{ 
          fontSize: "11px", 
          opacity: 0.75, 
          letterSpacing: "1px" 
        }}>
          SISTEMA DE TRÁMITES
        </p>
      </div>

      {/* Navegación */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        {rol === "ADMIN" && (
          <>
            <div style={sectionTitleStyle}>ADMINISTRACIÓN</div>
            <NavItem to="/admin/usuarios" icon="👥">Ver Usuarios</NavItem>
            <NavItem to="/admin/configuracion" icon="⚙️">Configuración</NavItem>
            <NavItem to="/admin/reportes" icon="📈">Reportes</NavItem>
            <NavItem to="/admin/documentos-finales" icon="📄">Documentos Finales</NavItem>
          </>
        )}

        {rol === "TRAMITES" && (
          <>
            <div style={sectionTitleStyle}>GESTIÓN</div>
            <NavItem to="/tramites" icon="📂">Ver Trámites</NavItem>
          </>
        )}

        {rol === "CAJA" && (
          <>
            <div style={sectionTitleStyle}>FINANZAS</div>
            <NavItem to="/caja" icon="💰">Cobrar Trámite</NavItem>
          </>
        )}

        {rol === "RECIBOS" && (
          <>
            <div style={sectionTitleStyle}>OPERACIONES</div>
            <NavItem to="/tramites/crear" icon="🧾">Crear Recibo</NavItem>
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ 
        borderTop: "1px solid rgba(255,255,255,0.12)", 
        paddingTop: "16px", 
        fontSize: "11px", 
        textAlign: "center", 
        opacity: 0.7 
      }}>
        Gobierno Municipal 2024-2027
      </div>
    </aside>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: "bold",
  color: "rgba(255,255,255,0.55)",
  margin: "12px 0 6px 12px",
  letterSpacing: "1px"
};