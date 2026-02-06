import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { colors } from "../../styles/theme";

interface Tramite {
  id: number;
  tramite_servicio: string;
  numero_tramite: string;
  estatus_pago: string;
  estatus: string;
  fecha_limite_entrega: string | null;
}

interface Documento {
  id: number;
  tipo: string;
  archivo: string;
}

export default function ListaTramites() {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [archivoFinal, setArchivoFinal] = useState<File | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarTramites();
  }, []);

  const cargarTramites = async () => {
    try {
      const res = await api.get("/tramites/");
      setTramites(res.data);
    } catch {
      setMensaje("❌ Error al cargar trámites");
    }
  };

  const verRecibo = (id: number) => navigate(`/recibo/${id}`);

  const verDocumentos = async (id: number) => {
    try {
      const res = await api.get(`/tramites/${id}/documentos/`);
      setDocumentos(res.data);
      setTramiteSeleccionado(id);
    } catch {
      alert("Error al cargar documentos");
    }
  };

  const subirDocumentoFinal = async () => {
    if (!tramiteSeleccionado || !archivoFinal) {
      alert("Selecciona un archivo");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("archivo", archivoFinal);
      await api.post(`/tramites/${tramiteSeleccionado}/subir-final/`, formData);
      alert("Documento subido correctamente");
      setArchivoFinal(null);
      verDocumentos(tramiteSeleccionado);
    } catch {
      alert("Error al subir archivo");
    }
  };

  const actualizarEstatus = async (id: number, estatus: string) => {
    try {
      await api.post(`/tramites/finalizar/${id}/`, { estatus });
      cargarTramites();
    } catch {
      alert("Error al actualizar trámite");
    }
  };

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-MX");
  };

  const tramitesFiltrados = tramites.filter(t => {
    const txt = busqueda.toLowerCase();
    return (
      t.tramite_servicio.toLowerCase().includes(txt) ||
      t.numero_tramite.toLowerCase().includes(txt) ||
      t.estatus_pago.toLowerCase().includes(txt) ||
      t.estatus.toLowerCase().includes(txt)
    );
  });

  const tieneDocumentoFinal = documentos.some(d => d.tipo === "FINAL");

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>
        Resumen de Trámites y Servicios
      </h2>

      {/* BUSCADOR RESPONSIVO */}
      <input
        placeholder="Buscar trámite..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={searchInput}
      />

      {/* CONTENEDOR DE TABLA CON SCROLL */}
      <div style={tableContainer}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={{ background: colors.greenPrimary, color: "white" }}>
              <tr>
                <th style={th}>Trámite/Servicio</th>
                <th style={th}>Número</th>
                <th style={th}>Pago</th>
                <th style={th}>Estatus</th>
                <th style={th}>Fecha límite</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramitesFiltrados.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{t.tramite_servicio}</td>
                  <td style={td}>{t.numero_tramite}</td>
                  <td style={td}>{t.estatus_pago}</td>
                  <td style={td}>{t.estatus}</td>
                  <td style={td}>{formatearFecha(t.fecha_limite_entrega)}</td>
                  <td style={td}>
                    <div style={actionsWrapper}>
                      <button style={btnGray} onClick={() => verDocumentos(t.id)}>Documentos</button>
                      {t.estatus_pago === "PAGADO" && (
                        <button style={btnBlue} onClick={() => verRecibo(t.id)}>Recibo</button>
                      )}
                      {["INICIADO", "EN_PROCESO", "PENDIENTE"].includes(t.estatus) && (
                        <>
                          <button
                            style={{...btnGreen, opacity: (!tieneDocumentoFinal || tramiteSeleccionado !== t.id) ? 0.6 : 1}}
                            disabled={!tieneDocumentoFinal || tramiteSeleccionado !== t.id}
                            onClick={() => actualizarEstatus(t.id, "CONCLUIDO")}
                          >
                            Concluir
                          </button>
                          <button style={btnRed} onClick={() => actualizarEstatus(t.id, "RECHAZADO")}>Rechazar</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENTOS RESPONSIVOS */}
      {tramiteSeleccionado && (
        <div style={docsCard}>
          <h3>Documentos</h3>
          <div style={{ marginTop: 15 }}>
            {documentos.length === 0 ? (
              <p>No hay documentos</p>
            ) : (
              documentos.map(doc => (
                <p key={doc.id} style={{ marginBottom: 10 }}>
                  📄 <a href={`http://localhost:8000${doc.archivo}`} target="_blank" rel="noreferrer" style={{ color: colors.greenPrimary }}>
                    {doc.tipo}
                  </a>
                </p>
              ))
            )}
          </div>
          <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />
          <div style={uploadBox}>
            <input
              type="file"
              onChange={e => setArchivoFinal(e.target.files?.[0] || null)}
              style={{ marginBottom: 10, width: "100%" }}
            />
            <button style={{...btnGreen, width: "100%", margin: 0, padding: 12}} onClick={subirDocumentoFinal}>
              Subir documento final
            </button>
          </div>
          {tieneDocumentoFinal && (
            <p style={{ color: "green", marginTop: 10, fontWeight: "bold" }}>
              ✓ Documento final cargado
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ===================== */
/* ESTILOS OPTIMIZADOS   */
/* ===================== */

const containerStyle: React.CSSProperties = {
  padding: "clamp(15px, 5vw, 40px)", // Padding dinámico según el tamaño de pantalla
  boxSizing: "border-box",
  minHeight: "100vh",
  maxWidth: "1200px",
  margin: "0 auto"
};

const searchInput: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  marginBottom: 20,
  fontSize: "16px", // Evita zoom en móviles
  boxSizing: "border-box"
};

const tableContainer: React.CSSProperties = {
  background: colors.white,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  overflow: "hidden", // Para que los bordes redondeados funcionen
  width: "100%",
  boxSizing: "border-box"
};

const actionsWrapper: React.CSSProperties = {
  display: "flex",
  gap: "5px",
  flexWrap: "nowrap"
};

const docsCard: React.CSSProperties = {
  marginTop: 30,
  background: colors.white,
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  boxSizing: "border-box"
};

const uploadBox: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "400px"
};

const th: React.CSSProperties = {
  padding: 12,
  textAlign: "left",
  fontSize: "14px",
  whiteSpace: "nowrap"
};

const td: React.CSSProperties = {
  padding: 12,
  fontSize: "14px",
  color: "#444"
};

const btnGray = {
  background: "#ecf0f1",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "12px"
};

const btnBlue = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "12px"
};

const btnGreen = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "12px"
};

const btnRed = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "12px"
};