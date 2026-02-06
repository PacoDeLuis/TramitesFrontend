import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

interface Usuario {
  id: number;
  username: string;
  email: string;
  rol: string;
  activo: boolean;
  area?: string;
}

interface Area {
  id: number;
  nombre: string;
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [ediciones, setEdiciones] = useState<{ [key: number]: Partial<Usuario & { password?: string }> }>({});
  const [verPassword, setVerPassword] = useState<{ [key: number]: boolean }>({});
  const [mensaje, setMensaje] = useState("");

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/admin/usuarios/");
      setUsuarios(res.data);
    } catch {
      alert("Error al cargar usuarios");
    }
  };

  const cargarAreas = async () => {
    try {
      const res = await api.get("/areas/");
      setAreas(res.data);
    } catch {
      alert("Error al cargar áreas");
    }
  };

  useEffect(() => {
    Promise.all([cargarUsuarios(), cargarAreas()]).finally(() => setLoading(false));
  }, []);

  const cambiarRol = async (id: number, rol: string) => {
    try {
      await api.post(`/admin/usuarios/${id}/rol/`, { rol });
      cargarUsuarios();
    } catch {
      alert("Error al cambiar rol");
    }
  };

  const cambiarArea = async (id: number, areaId: string) => {
    try {
      await api.post(`/admin/usuarios/${id}/area/`, { area_id: areaId });
      cargarUsuarios();
    } catch {
      alert("Error al cambiar área");
    }
  };

  const cambiarEstado = async (id: number) => {
    try {
      await api.post(`/admin/usuarios/${id}/estado/`);
      cargarUsuarios();
    } catch {
      alert("Error al cambiar estado");
    }
  };

  const actualizarCampo = (id: number, campo: string, valor: string) => {
    setEdiciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }));
  };

  const guardarCambios = async (id: number) => {
    const data = ediciones[id];
    if (!data || Object.keys(data).length === 0) return;
    try {
      await api.patch(`/admin/usuarios/${id}/actualizar-credenciales/`, data);
      setEdiciones(prev => ({ ...prev, [id]: {} }));
      setVerPassword(prev => ({ ...prev, [id]: false }));
      cargarUsuarios();
      setMensaje("Usuario actualizado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      alert("Error al actualizar usuario");
    }
  };

  const usuariosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return usuarios;
    const texto = busqueda.toLowerCase();
    return usuarios.filter(u => {
      const areaNombre = areas.find(a => a.nombre === u.area)?.nombre || "";
      return (
        u.username.toLowerCase().includes(texto) ||
        (u.email || "").toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto) ||
        areaNombre.toLowerCase().includes(texto) ||
        (u.activo ? "activo" : "inactivo").includes(texto)
      );
    });
  }, [busqueda, usuarios, areas]);

  if (loading) return <p style={{ padding: 40 }}>Cargando usuarios...</p>;

  return (
    <div style={{ padding: "clamp(15px, 5vw, 40px)", boxSizing: "border-box" }}>
      {/* HEADER RESPONSIVO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 15
        }}
      >
        <h2 style={{ margin: 0 }}>Gestión de Usuarios</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: "100%", maxWidth: "fit-content" }}>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={searchInput}
            placeholder="Buscar usuarios..."
            autoComplete="off"
          />

          <Link to="/admin/usuarios/crear" style={{ flexGrow: 1 }}>
            <button style={{ ...btnBlue, width: "100%" }}>+ Crear usuario</button>
          </Link>
        </div>
      </div>

      {mensaje && (
        <div style={{ marginBottom: 12, color: "#27ae60", fontWeight: 500 }}>
          {mensaje}
        </div>
      )}

      {/* CARD CON SCROLL HORIZONTAL AUTOMÁTICO */}
      <div style={card}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead style={thead}>
              <tr>
                <th style={th}>Usuario</th>
                <th style={th}>Email</th>
                <th style={th}>Password</th>
                <th style={th}>Rol</th>
                <th style={th}>Área</th>
                <th style={{ ...th, textAlign: "center" }}>Estado</th>
                <th style={{ ...th, textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                    No se encontraron usuarios
                  </td>
                </tr>
              )}

              {usuariosFiltrados.map(u => (
                <tr key={u.id} style={rowStyle}>
                  <td style={td}>
                    <input
                      type="text"
                      value={ediciones[u.id]?.username ?? u.username}
                      onChange={(e) => actualizarCampo(u.id, "username", e.target.value)}
                      style={inputStyle}
                      autoComplete="off"
                    />
                  </td>
                  <td style={td}>
                    <input
                      type="email"
                      value={ediciones[u.id]?.email ?? u.email ?? ""}
                      onChange={(e) => actualizarCampo(u.id, "email", e.target.value)}
                      style={inputStyle}
                      autoComplete="off"
                    />
                  </td>
                  <td style={td}>
                    <div style={{ position: "relative" }}>
                      <input
                        type={verPassword[u.id] ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        onChange={(e) => actualizarCampo(u.id, "password", e.target.value)}
                        style={{ ...inputStyle, paddingRight: 45 }}
                        value={ediciones[u.id]?.password ?? ""}
                        autoComplete="new-password"
                      />
                      <span
                        onClick={() => setVerPassword(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                        style={eyeToggle}
                      >
                        {verPassword[u.id] ? "Ocultar" : "Ver"}
                      </span>
                    </div>
                  </td>
                  <td style={td}>
                    <select
                      style={inputStyle}
                      value={u.rol}
                      onChange={(e) => cambiarRol(u.id, e.target.value)}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="TRAMITES">TRÁMITES</option>
                      <option value="CAJA">CAJA</option>
                      <option value="RECIBOS">RECIBOS</option>
                    </select>
                  </td>
                  <td style={td}>
                    <select
                      style={inputStyle}
                      value={areas.find(a => a.nombre === u.area)?.id || ""}
                      onChange={(e) => cambiarArea(u.id, e.target.value)}
                    >
                      <option value="">-- Sin área --</option>
                      {areas.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td style={tdCenter}>
                    <span style={badge(u.activo)}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={tdCenter}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button
                        style={{...(u.activo ? btnRed : btnGreen), whiteSpace: "nowrap"}}
                        onClick={() => cambiarEstado(u.id)}
                      >
                        {u.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        style={{...btnBlue, whiteSpace: "nowrap"}}
                        onClick={() => guardarCambios(u.id)}
                      >
                        Guardar
                      </button>
                    </div>
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

/* ===================== ESTILOS ACTUALIZADOS ===================== */

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 18,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  padding: "clamp(10px, 3vw, 20px)",
  overflow: "hidden" // Evita que la sombra se corte
};

const thead: React.CSSProperties = {
  background: "#27ae60",
  color: "white",
};

const searchInput: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  flex: "1 1 200px", // Crece y se encoge
  fontSize: "16px" // Mejor en móviles para evitar zoom forzado
};

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
  width: "100%",
  boxSizing: "border-box",
  minWidth: "120px", // Evita que el input desaparezca
  fontSize: "14px"
};

const th: React.CSSProperties = {
  padding: "14px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "14px"
};

const td: React.CSSProperties = {
  padding: "10px 8px"
};

const tdCenter: React.CSSProperties = {
  padding: "10px 8px",
  textAlign: "center"
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
};

const eyeToggle: React.CSSProperties = {
  position: "absolute",
  right: 8,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: 11,
  color: "#555",
  userSelect: "none",
  background: "white",
  padding: "2px 4px"
};

const badge = (active: boolean): React.CSSProperties => ({
  padding: "4px 10px",
  borderRadius: "14px",
  fontSize: "12px",
  fontWeight: 500,
  color: "white",
  background: active ? "#27ae60" : "#e74c3c",
  display: "inline-block",
  whiteSpace: "nowrap"
});

const btnBlue: React.CSSProperties = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 500
};

const btnGreen: React.CSSProperties = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: "13px"
};

const btnRed: React.CSSProperties = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: "13px"
};