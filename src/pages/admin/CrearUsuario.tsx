import { useEffect, useState } from "react";
import api from "../../api/api";
import React from "react";

interface Area {
  id: number;
  nombre: string;
}

export default function CrearUsuario() {
  const [usuario, setUsuario] = useState({
    username: "",
    password: "",
    email: "",
    rol: "TRAMITES",
    area_id: ""
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"ok" | "error" | "">("");
  const [verPassword, setVerPassword] = useState(false);

  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    const res = await api.get("/areas/");
    setAreas(res.data);
  };

  const crearUsuario = async () => {
    setMensaje("");
    if (!usuario.username || !usuario.password) {
      setMensaje("Usuario y contraseña son obligatorios");
      setTipoMensaje("error");
      return;
    }
    if ((usuario.rol === "TRAMITES" || usuario.rol === "RECIBOS") && !usuario.area_id) {
      setMensaje("Debe asignar un área al usuario");
      setTipoMensaje("error");
      return;
    }
    try {
      await api.post("/admin/usuarios/crear/", usuario);
      setMensaje("Usuario creado correctamente");
      setTipoMensaje("ok");
      setUsuario({ username: "", password: "", email: "", rol: "TRAMITES", area_id: "" });
    } catch {
      setMensaje("Error al crear usuario");
      setTipoMensaje("error");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={card}>
        <h2 style={{ marginBottom: 20, textAlign: "center", fontSize: "22px" }}>Crear usuario</h2>

        {mensaje && (
          <div style={{
            marginBottom: 15, padding: 10, borderRadius: 8, textAlign: "center",
            background: tipoMensaje === "ok" ? "#dff5e4" : "#fde2e2",
            color: tipoMensaje === "ok" ? "#1e8449" : "#c0392b"
          }}>
            {mensaje}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Usuario"
            autoComplete="off"
            value={usuario.username}
            onChange={e => setUsuario({ ...usuario, username: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Email"
            value={usuario.email}
            onChange={e => setUsuario({ ...usuario, email: e.target.value })}
            style={inputStyle}
          />

          {/* ESTRUCTURA DE CONTRASEÑA CORREGIDA */}
          <div style={passwordWrapper}>
            <input
              type={verPassword ? "text" : "password"}
              placeholder="Contraseña"
              autoComplete="new-password"
              value={usuario.password}
              onChange={e => setUsuario({ ...usuario, password: e.target.value })}
              style={inputInsideStyle} 
            />
            <span
              style={toggleStyle}
              onClick={() => setVerPassword(!verPassword)}
            >
              {verPassword ? "Ocultar" : "Ver"}
            </span>
          </div>

          <select
            value={usuario.rol}
            onChange={e => setUsuario({ ...usuario, rol: e.target.value })}
            style={inputStyle}
          >
            <option value="TRAMITES">TRÁMITES</option>
            <option value="CAJA">CAJA</option>
            <option value="RECIBOS">RECIBOS</option>
          </select>

          {(usuario.rol === "TRAMITES" || usuario.rol === "RECIBOS") && (
            <select
              value={usuario.area_id}
              onChange={e => setUsuario({ ...usuario, area_id: e.target.value })}
              style={inputStyle}
            >
              <option value="">-- Seleccione área --</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          )}

          <button onClick={crearUsuario} style={btnBlue}>
            Crear usuario
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== */
/* ESTILOS UNIFICADOS */
/* ===================== */

const containerStyle: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  boxSizing: "border-box",
  background: "#f4f6f8"
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  padding: "30px",
  width: "100%",
  maxWidth: "380px",
  boxSizing: "border-box"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff"
};

const passwordWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "14px",
  background: "#fff",
  boxSizing: "border-box",
  paddingRight: "14px"
};

const inputInsideStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 14px",
  border: "none",
  background: "transparent",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box"
};

const toggleStyle: React.CSSProperties = {
  cursor: "pointer",
  color: "#3498db",
  fontSize: "13px",
  userSelect: "none",
  whiteSpace: "nowrap",
  fontWeight: 500
};

const btnBlue: React.CSSProperties = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "16px",
  cursor: "pointer",
  marginTop: "8px",
  fontSize: "15px",
  fontWeight: 600,
  width: "100%"
};