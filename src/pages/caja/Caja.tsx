import { useState } from "react";
import api from "../../api/api";

export default function Caja() {
  const [numero, setNumero] = useState("");
  const [tramite, setTramite] = useState<any>(null);
  const [formaPago, setFormaPago] = useState("");
  const [mensaje, setMensaje] = useState("");

  const buscarTramite = async () => {
    setMensaje("");
    setTramite(null);

    if (!numero) {
      setMensaje("Ingresa un número de trámite");
      return;
    }

    try {
      const res = await api.post("/consulta-tramite/", {
        numero_tramite: numero
      });
      setTramite(res.data);
    } catch {
      setMensaje("❌ Trámite no encontrado");
    }
  };

  const cobrar = async () => {
    if (!formaPago) {
      setMensaje("Selecciona una forma de pago");
      return;
    }

    try {
      await api.post(`/tramites/pagar/${tramite.id}/`, {
        forma_pago: formaPago
      });

      setMensaje("✅ Pago registrado correctamente");
      setTramite(null);
      setNumero("");
      setFormaPago("");
    } catch {
      setMensaje("❌ Error al registrar el pago");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={card}>
        <h2 style={{ marginBottom: 20 }}>
          Módulo de Caja
        </h2>

        <input
          style={input}
          placeholder="Número de trámite"
          value={numero}
          onChange={e => setNumero(e.target.value)}
        />

        <button style={btnGreen} onClick={buscarTramite}>
          Buscar trámite
        </button>

        {mensaje && (
          <div style={messageBox}>{mensaje}</div>
        )}

        {tramite && (
          <div style={tramiteCard}>
            <h4 style={{ marginBottom: 10 }}>Datos del trámite</h4>

            <div style={row}>
              <b>Nombre:</b> {tramite.nombre} {tramite.apellido_paterno} {tramite.apellido_materno}
            </div>

            <div style={row}>
              <b>Correo:</b> {tramite.correo}
            </div>

            <div style={row}>
              <b>Teléfono:</b> {tramite.telefono}
            </div>

            <div style={row}>
              <b>Estatus:</b> {tramite.estatus}
            </div>

            <hr style={{ margin: "15px 0", border: "0.5px solid #eee" }} />

            <h4 style={{ marginBottom: 10 }}>Datos de pago</h4>

            <div style={row}>
              <b>Total a pagar:</b> ${tramite.total}
            </div>

            <select
              style={input}
              value={formaPago}
              onChange={e => setFormaPago(e.target.value)}
            >
              <option value="">Forma de pago</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>

            <button style={btnBlue} onClick={cobrar}>
              Cobrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== */
/* ESTILOS RESPONSIVOS   */
/* ===================== */

const containerStyle: React.CSSProperties = {
  padding: "20px", // Reducido para móviles
  background: "#f4f6f8",
  minHeight: "100vh",
  boxSizing: "border-box" // Asegura que el padding no rompa el ancho
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  padding: "clamp(15px, 5vw, 30px)", // Padding fluido
  maxWidth: "500px",
  width: "100%", // Ocupa todo el ancho en móvil
  margin: "0 auto",
  boxSizing: "border-box"
};

const tramiteCard: React.CSSProperties = {
  background: "#fafafa",
  borderRadius: 12,
  padding: "15px",
  marginTop: 20,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  boxSizing: "border-box",
  wordBreak: "break-word" // Evita que textos largos (como correos) rompan el diseño
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px", // Un poco más alto para facilitar toque en móvil
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 12,
  boxSizing: "border-box",
  fontSize: "16px" // Importante: evita zoom automático en iPhone/Android al enfocar
};

const row = {
  marginBottom: 8,
  fontSize: "15px"
};

const btnGreen: React.CSSProperties = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 8,
  cursor: "pointer",
  width: "100%",
  fontSize: "16px",
  fontWeight: 600
};

const btnBlue: React.CSSProperties = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 8,
  cursor: "pointer",
  width: "100%",
  marginTop: 10,
  fontSize: "16px",
  fontWeight: 600
};

const messageBox: React.CSSProperties = {
  marginTop: 12,
  fontWeight: 500,
  textAlign: "center" as const
};