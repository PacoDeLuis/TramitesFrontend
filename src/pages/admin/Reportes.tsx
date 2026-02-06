import { useEffect, useState } from "react";
import api from "../../api/api";
import React from "react";

interface ReporteFila {
  tramite: string;
  area: string;
  iniciados: number;
  pagados: number;
  concluidos: number;
  pendientes: number;
  fuera_plazo: number;
}

export default function Reportes() {
  const [rows, setRows] = useState<ReporteFila[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reportes/")
      .then(res => setRows(res.data))
      .catch(() => alert("Error al cargar reportes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={loadingText}>Cargando reportes...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>
        Módulo 3: Reportes
      </h2>

      <div style={card}>
        {/* CONTENEDOR RESPONSIVO: Permite scroll horizontal en móviles */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={{ background: "#27ae60", color: "white" }}>
              <tr>
                <th style={th}>Trámite o Servicio</th>
                <th style={th}>Área</th>
                <th style={th}>Iniciados</th>
                <th style={th}>Pagados</th>
                <th style={th}>Concluidos</th>
                <th style={th}>Pendientes</th>
                <th style={th}>Fuera de plazo</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{r.tramite}</td>
                  <td style={td}>{r.area}</td>
                  <td style={td}>{r.iniciados}</td>
                  <td style={td}>{r.pagados}</td>
                  <td style={td}>{r.concluidos}</td>
                  <td style={td}>{r.pendientes}</td>
                  <td style={td}>{r.fuera_plazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===================== */
/* ESTILOS (AJUSTADOS) */
/* ===================== */

const containerStyle: React.CSSProperties = {
  // padding responsivo: 20px en móvil, 40px en escritorio
  padding: "clamp(20px, 5vw, 40px)", 
  background: "#f4f6f8", 
  minHeight: "100vh",
  boxSizing: "border-box"
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  padding: 20,
  marginBottom: 30,
  width: "100%",
  boxSizing: "border-box"
};

const th: React.CSSProperties = {
  padding: 12,
  textAlign: "left",
  fontSize: "14px", // Un poco más pequeña para mejorar ajuste
  whiteSpace: "nowrap" // Evita que los títulos se amontonen en varias líneas
};

const td: React.CSSProperties = {
  padding: 12,
  fontSize: "14px"
};

const loadingText: React.CSSProperties = {
  padding: 40
};