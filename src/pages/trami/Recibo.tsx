import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import logo from "../../assets/logo.png";

export default function Recibo() {
  const { tramiteId } = useParams();
  const [recibo, setRecibo] = useState<any>(null);

  useEffect(() => {
    api.get(`/recibo/${tramiteId}/`)
      .then(res => setRecibo(res.data))
      .catch(() => alert("Error al cargar recibo"));
  }, []);

  const formatearFechaHora = (fecha: string) => {
    if (!fecha) return "";
    const d = new Date(fecha.replace("Z", ""));
    return d.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (!recibo) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando recibo...</p>;

  return (
    <div style={page}>
      {/* Estilos dinámicos para manejar el responsive sin archivos CSS externos */}
      <style>{`
        @media (max-width: 600px) {
          .recibo-header { flex-direction: column !important; text-align: center; }
          .recibo-data-grid { grid-template-columns: 1fr !important; }
          .recibo-folio { width: 100%; box-sizing: border-box; }
        }
        @media print {
          .btn-print { display: none !important; }
          body { background: white !important; }
          .recibo-page { padding: 0 !important; }
        }
      `}</style>

      <div className="recibo-print" style={facturaBox}>
        {/* ================= ENCABEZADO ================= */}
        <div className="recibo-header" style={header}>
          <img src={logo} alt="Logo" style={logoStyle} />

          <div style={empresaInfo}>
            <h3 style={{ margin: 0 }}>AYUNTAMIENTO DE HUAMANTLA</h3>
            <small>Sistema de Trámites y Servicios</small>
          </div>

          <div className="recibo-folio" style={folioBox}>
            <div><b>RECIBO</b></div>
            <div>Folio:</div>
            <b>{recibo.cadena_pago}</b>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* ================= DATOS ================= */}
        <div className="recibo-data-grid" style={dataGrid}>
          <div>
            <b>Nombre:</b><br />
            {recibo.nombre}
          </div>
          <div>
            <b>No. Trámite:</b><br />
            {recibo.numero_tramite}
          </div>
          <div>
            <b>Fecha de pago:</b><br />
            {formatearFechaHora(recibo.fecha_pago)}
          </div>
          <div>
            <b>Forma de pago:</b><br />
            {recibo.forma_pago}
          </div>
        </div>

        {/* ================= TABLA ================= */}
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Concepto</th>
                <th style={th}>Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>{recibo.tramite}</td>
                <td style={td}>${recibo.subtotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================= TOTALES ================= */}
        <div style={totalesBox}>
          <div style={totalesRow}>
            <span>Subtotal:</span>
            <span>${recibo.subtotal}</span>
          </div>
          <div style={totalesRowBig}>
            <span>Total:</span>
            <span>${recibo.total}</span>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <p style={nota}>
          Este documento es un comprobante oficial de pago del Ayuntamiento de Huamantla.
        </p>

        <button className="btn-print" style={btnPrint} onClick={() => window.print()}>
          🖨 Imprimir recibo
        </button>
      </div>
    </div>
  );
}

/* ================= */
/* ESTILOS */
/* ================= */

const page: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f6f8",
  padding: "20px",
  boxSizing: "border-box"
};

const facturaBox: React.CSSProperties = {
  background: "white",
  width: "100%",
  maxWidth: "700px",
  padding: "clamp(15px, 5vw, 28px)",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  boxSizing: "border-box"
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap"
};

const logoStyle = {
  width: "90px",
  height: "auto"
};

const empresaInfo = {
  flex: 1,
  textAlign: "center" as const,
  minWidth: "200px"
};

const folioBox = {
  border: "2px solid #333",
  padding: "8px 12px",
  textAlign: "center" as const,
  minWidth: "120px"
};

const dataGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  margin: "18px 0"
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginTop: "10px"
};

const th = {
  border: "1px solid #333",
  padding: "8px",
  background: "#f1f1f1",
  fontSize: "14px",
  textAlign: "left" as const
};

const td = {
  border: "1px solid #333",
  padding: "8px",
  fontSize: "14px"
};

const totalesBox = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-end",
  gap: "6px"
};

const totalesRow = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "200px"
};

const totalesRowBig = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "200px",
  fontSize: "18px",
  fontWeight: "bold"
};

const nota = {
  fontSize: "12px",
  color: "#555",
  textAlign: "center" as const
};

const btnPrint = {
  marginTop: "20px",
  width: "100%",
  background: "#1976d2",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};