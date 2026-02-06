import { useEffect, useState } from "react";
import api from "../../api/api";

interface TramiteServicio {
  id: number;
  nombre: string;
}

export default function CrearTramite() {
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [monto, setMonto] = useState("");
  const [descuento, setDescuento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [tramiteServicio, setTramiteServicio] = useState<number | "">("");
  const [tramites, setTramites] = useState<TramiteServicio[]>([]);
  const [documentos, setDocumentos] = useState<FileList | null>(null);
  const [mensaje, setMensaje] = useState("");

  const total = Number(monto || 0) - Number(descuento || 0);

  useEffect(() => {
    api.get("/catalogos/tramites-servicios/")
      .then(res => setTramites(res.data))
      .catch(() => setMensaje("❌ Error al cargar trámites"));
  }, []);

  const crear = async () => {
    if (!nombre || !apellidoP || !tramiteServicio || !monto) {
      setMensaje("Campos obligatorios incompletos");
      return;
    }
    // Lógica de FormData... (igual a la anterior)
  };

  return (
    <div style={{ padding: "20px", background: "#f4f6f8", minHeight: "100vh" }}>
      <div style={formCard}>
        <h2 style={{ marginBottom: 25, color: "#1a4a3e" }}>Registrar Recibo</h2>

        <div style={formGrid}>
          <input style={input} placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input style={input} placeholder="Apellido Paterno" value={apellidoP} onChange={e => setApellidoP(e.target.value)} />
          <input style={input} placeholder="Apellido Materno" value={apellidoM} onChange={e => setApellidoM(e.target.value)} />
          <input style={input} placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
          <input style={input} placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
          <input style={input} type="number" placeholder="Monto" value={monto} onChange={e => setMonto(e.target.value)} />
          <input style={input} type="number" placeholder="Descuento" value={descuento} onChange={e => setDescuento(e.target.value)} />
        </div>

        <div style={totalBox}>Total: ${total.toFixed(2)}</div>

        <textarea
          style={textarea}
          placeholder="Observaciones"
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
        />

        <select
          style={{ ...input, width: "100%", marginTop: 15 }}
          value={tramiteServicio}
          onChange={e => setTramiteServicio(Number(e.target.value))}
        >
          <option value="">Selecciona un trámite</option>
          {tramites.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>

        <input type="file" multiple style={{ marginTop: 15, width: "100%" }} onChange={e => setDocumentos(e.target.files)} />

        <div style={{ textAlign: "right" }}>
          <button style={btnGreen} onClick={crear}>Guardar trámite</button>
        </div>

        {mensaje && <div style={{ marginTop: 15, textAlign: "center", fontWeight: 600 }}>{mensaje}</div>}
      </div>
    </div>
  );
}

const formCard: React.CSSProperties = {
  background: "white",
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  padding: "30px",
  maxWidth: "900px",
  margin: "auto",
  boxSizing: "border-box"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 15
};

const input: React.CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box"
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: 100,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  marginTop: 15,
  boxSizing: "border-box"
};

const totalBox = {
  margin: "20px 0",
  fontWeight: 700,
  fontSize: "22px",
  color: "#27ae60",
  borderBottom: "2px solid #eee",
  paddingBottom: "10px"
};

const btnGreen: React.CSSProperties = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "15px 40px",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 20,
  fontSize: "16px",
  fontWeight: 600,
  width: "100%",
  maxWidth: "300px" // Limita el ancho en PC para que no sea gigante
};