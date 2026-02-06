import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { colors } from "../../styles/theme";
import React from "react";
import logo from "../../assets/logo.png";

interface Tramite {
  numero_tramite: string;
  estatus: string;
  fecha_pago?: string | null;
  fecha_limite_entrega?: string | null;
}

const formatearFecha = (fecha?: string | null) => {
  if (!fecha) return "";
  const d = new Date(fecha);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function ConsultaTramite() {
  const [numero, setNumero] = useState("");
  const [resultado, setResultado] = useState<Tramite | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const consultar = async () => {
    setError("");
    setResultado(null);
    try {
      const res = await api.post<Tramite>("consulta-tramite/", {
        numero_tramite: numero.trim()
      });
      setResultado(res.data);
    } catch {
      setError("No se encontró ningún trámite con ese número.");
    }
  };

  /* ================== ESTILOS RESPONSIVOS ================== */

  const page: React.CSSProperties = {
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
    flexWrap: "wrap",
    gap: "15px"
  };

  const logoBox: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    flex: "1 1 auto"
  };

  const logoStyle: React.CSSProperties = {
    width: "42px",
    height: "42px",
    objectFit: "contain"
  };

  const logoText: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(14px, 4vw, 18px)",
    fontWeight: 600
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "10px",
    opacity: 0.9
  };

  const btnBack: React.CSSProperties = {
    background: colors.white,
    color: colors.greenDark,
    border: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 500,
    whiteSpace: "nowrap"
  };

  const container: React.CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box"
  };

  const card: React.CSSProperties = {
    background: colors.white,
    padding: "clamp(25px, 8vw, 44px)",
    borderRadius: "28px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "520px",
    textAlign: "center",
    boxSizing: "border-box"
  };

  const searchBox: React.CSSProperties = {
    display: "flex",
    flexDirection: window.innerWidth < 480 ? "column" : "row", // Se apila en pantallas muy pequeñas
    gap: "12px",
    marginTop: "20px"
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "16px", // Evita zoom en iOS
    outline: "none",
    boxSizing: "border-box"
  };

  const btnGreen: React.CSSProperties = {
    background: colors.greenPrimary,
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px"
  };

  const resultadoBox: React.CSSProperties = {
    marginTop: "26px",
    background: "#fafafa",
    padding: "22px",
    borderRadius: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "left",
    wordBreak: "break-word"
  };

  const badgeBase: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: "20px",
    color: "white",
    fontWeight: 600,
    display: "inline-block",
    marginBottom: "12px",
    fontSize: "13px"
  };

  return (
    <div style={page}>
      {/* Estilo para manejar el cambio de dirección del buscador en móvil */}
      <style>{`
        @media (max-width: 480px) {
          .search-container { flex-direction: column !important; }
          .search-container button { width: 100% !important; }
        }
      `}</style>

      <header style={headerStyle}>
        <div style={logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" style={logoStyle} />
          <div style={logoText}>
            <span style={titleStyle}>AYUNTAMIENTO DE HUAMANTLA</span>
            <small style={subtitleStyle}>SISTEMA DE TRÁMITES Y SERVICIOS</small>
          </div>
        </div>
        <button style={btnBack} onClick={() => navigate("/")}>
          Volver
        </button>
      </header>

      <div style={container}>
        <div style={card}>
          <h2 style={{ color: colors.greenDark, marginBottom: "8px", fontSize: "clamp(20px, 5vw, 24px)" }}>
            Consulta tu trámite
          </h2>
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
            Ingresa el folio para conocer el estado de tu solicitud
          </p>

          <div className="search-container" style={searchBox}>
            <input
              style={inputStyle}
              value={numero}
              onChange={e => setNumero(e.target.value)}
              placeholder="Ej: TS-000123"
            />
            <button style={btnGreen} onClick={consultar}>
              Buscar
            </button>
          </div>

          {error && <div style={{...resultadoBox, background: "#fdecea", color: "#c62828", boxShadow: "none"}}>{error}</div>}

          {resultado && (
            <div style={resultadoBox}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap" }}>
                <b>Folio:</b>
                <span>{resultado.numero_tramite}</span>
              </div>

              <div style={{
                ...badgeBase,
                background: resultado.estatus === "PAGADO" ? colors.greenPrimary : 
                            resultado.estatus === "PENDIENTE" ? "#f39c12" : "#3498db"
              }}>
                {resultado.estatus}
              </div>

              <hr style={{ border: "0.5px solid #eee", margin: "14px 0" }} />

              <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {resultado.fecha_pago ? (
                  <><b>Fecha de pago:</b><br />{formatearFecha(resultado.fecha_pago)}</>
                ) : (
                  <><b>Fecha límite:</b><br />{formatearFecha(resultado.fecha_limite_entrega)}</>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}