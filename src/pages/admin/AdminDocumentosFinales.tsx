import { useEffect, useState } from "react";
import api from "../../api/api";
import React from "react";

export default function AdminDocumentosFinalesAdmin() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");

  const cargarDocumentos = async () => {
    try {
      const res = await api.get("/tramites/documentos-finales/");
      setDocumentos(res.data);
    } catch {
      setMensaje("Error al cargar documentos finales");
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>
        Documentos Finales de Trámites
      </h2>

      {mensaje && (
        <p style={errorText}>{mensaje}</p>
      )}

      <div style={card}>
        {/* CONTENEDOR RESPONSIVO APLICADO */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead style={{ background: "#27ae60", color: "white" }}>
              <tr>
                <th style={th}>No. Trámite</th>
                <th style={th}>Trámite / Servicio</th>
                <th style={th}>Documento Final</th>
                <th style={th}>Enviado por</th>
                <th style={th}>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {documentos.map(d => (
                <tr key={d.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{d.numero_tramite}</td>
                  <td style={td}>{d.tramite_servicio}</td>
                  <td style={td}>
                    <a
                      href={`http://localhost:8000${d.archivo}`}
                      target="_blank"
                      rel="noreferrer"
                      style={linkFile}
                    >
                      Ver documento
                    </a>
                  </td>
                  <td style={td}>{d.enviado_por}</td>
                  <td style={td}>
                    {new Date(d.fecha_subida).toLocaleString("es-MX")}
                  </td>
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
/* ESTILOS PRESERVADOS */
/* ===================== */

const containerStyle: React.CSSProperties = {
  padding: "clamp(20px, 5vw, 40px)", // Ajuste suave de espacio para móvil
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
  whiteSpace: "nowrap" // Mantiene los títulos en una línea
};

const td: React.CSSProperties = {
  padding: 12
};

const errorText = {
  color: "#e74c3c",
  marginBottom: 10
};

const linkFile = {
  color: "#3498db",
  textDecoration: "none",
  fontWeight: 500
};