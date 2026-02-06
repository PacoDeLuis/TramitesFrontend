import { useEffect, useState } from "react";
import api from "../../api/api";
import { colors } from "../../styles/theme";

interface Area {
  id: number;
  nombre: string;
}

interface TramiteServicio {
  id: number;
  nombre: string;
  tipo: "TRAMITE" | "SERVICIO";
  descripcion: string;
  area_responsable: Area;
  activo: boolean;
}

export default function ConfiguracionSistema() {
  const [items, setItems] = useState<TramiteServicio[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    tipo: "TRAMITE",
    descripcion: "",
    area_responsable: "",
  });

  const [nuevaArea, setNuevaArea] = useState("");

  const cargarCatalogo = async () => {
    try {
      const res = await api.get("/catalogos/tramites-servicios/");
      setItems(res.data);
    } catch {
      alert("Error al cargar trámites");
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
    Promise.all([cargarCatalogo(), cargarAreas()])
      .finally(() => setLoading(false));
  }, []);

  const crearArea = async () => {
    if (!nuevaArea) {
      alert("Escribe el nombre del área");
      return;
    }
    try {
      await api.post("/usuarios/areas/", { nombre: nuevaArea });
      setNuevaArea("");
      cargarAreas();
    } catch {
      alert("Error al crear área");
    }
  };

  const crearItem = async () => {
    if (!nuevo.nombre || !nuevo.area_responsable) {
      alert("Nombre y área son obligatorios");
      return;
    }
    try {
      await api.post("/catalogos/tramites-servicios/", nuevo);
      resetForm();
      cargarCatalogo();
    } catch {
      alert("Error al crear trámite/servicio");
    }
  };

  const actualizarItem = async () => {
    if (!nuevo.nombre || !nuevo.area_responsable) {
      alert("Nombre y área son obligatorios");
      return;
    }
    try {
      await api.put(`/catalogos/tramites-servicios/${editandoId}/`, nuevo);
      resetForm();
      cargarCatalogo();
    } catch {
      alert("Error al actualizar");
    }
  };

  const resetForm = () => {
    setNuevo({
      nombre: "",
      tipo: "TRAMITE",
      descripcion: "",
      area_responsable: "",
    });
    setEditandoId(null);
  };

  const cambiarEstado = async (id: number) => {
    try {
      await api.post(`/catalogos/tramites-servicios/${id}/estado/`);
      cargarCatalogo();
    } catch {
      alert("Error al cambiar estado");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando configuración...</p>;

  return (
    <div className="page-container" style={{ minHeight: "100vh" }}>
      <h2 style={{ marginBottom: 20, color: colors.greenDark }}>
        Configuración de Trámites y Servicios
      </h2>

      {/* CREAR ÁREA */}
      <div style={card}>
        <h3 style={cardTitle}>Crear nueva área</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
            placeholder="Nombre del área"
            value={nuevaArea}
            onChange={(e) => setNuevaArea(e.target.value)}
          />
          <button style={btnGreen} onClick={crearArea}>
            Crear área
          </button>
        </div>
      </div>

      {/* FORM TRÁMITE */}
      <div style={card}>
        <h3 style={cardTitle}>
          {editandoId ? "Editar trámite / servicio" : "Nuevo trámite / servicio"}
        </h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
          <select
            style={{ ...inputStyle, flex: 1, minWidth: "150px" }}
            value={nuevo.tipo}
            onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value as any })}
          >
            <option value="TRAMITE">Trámite</option>
            <option value="SERVICIO">Servicio</option>
          </select>
          <select
            style={{ ...inputStyle, flex: 1, minWidth: "150px" }}
            value={nuevo.area_responsable}
            onChange={(e) => setNuevo({ ...nuevo, area_responsable: e.target.value })}
          >
            <option value="">Selecciona área</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 5 }}>
            <button
              style={{ ...(editandoId ? btnBlue : btnGreen), flex: 1 }}
              onClick={editandoId ? actualizarItem : crearItem}
            >
              {editandoId ? "Actualizar" : "Crear"}
            </button>
            {editandoId && (
              <button style={{ ...btnGray, flex: 1 }} onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLA RESPONSIVA CON DESLIZAMIENTO */}
      <div style={card}>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={thead}>
              <tr>
                <th style={th}>Nombre</th>
                <th style={th}>Tipo</th>
                <th style={th}>Área</th>
                <th style={{ ...th, textAlign: "center" }}>Estado</th>
                <th style={{ ...th, textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} style={rowStyle}>
                  <td style={td}>{i.nombre}</td>
                  <td style={td}>{i.tipo}</td>
                  <td style={td}>{i.area_responsable?.nombre}</td>
                  <td style={tdCenter}>
                    <span style={badge(i.activo)}>
                      {i.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={tdCenter}>
                    <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                      <button
                        style={btnBlueSmall}
                        onClick={() => {
                          setNuevo({
                            nombre: i.nombre,
                            tipo: i.tipo,
                            descripcion: i.descripcion,
                            area_responsable: String(i.area_responsable?.id),
                          });
                          setEditandoId(i.id);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        style={i.activo ? btnRedSmall : btnGreenSmall}
                        onClick={() => cambiarEstado(i.id)}
                      >
                        {i.activo ? "Estado" : "Activar"}
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

/* ===================== */
/* ESTILOS               */
/* ===================== */

const card = {
  background: "white",
  borderRadius: 18,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  padding: 20,
  marginBottom: 25
};

const cardTitle = {
  fontSize: "16px",
  marginBottom: "15px",
  color: "#333",
  fontWeight: 600
};

const thead: React.CSSProperties = {
  background: "#27ae60",
  color: "white"
};

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: "14px"
};

const th: React.CSSProperties = {
  padding: "14px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "14px"
};

const td: React.CSSProperties = {
  padding: "14px 12px",
  fontSize: "14px"
};

const tdCenter: React.CSSProperties = {
  padding: "14px 12px",
  textAlign: "center"
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee"
};

const badge = (active: boolean): React.CSSProperties => ({
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: 600,
  color: "white",
  background: active ? "#27ae60" : "#e74c3c",
  display: "inline-block"
});

const btnGreen = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};

const btnBlue = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};

const btnGray = {
  background: "#95a5a6",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};

/* Botones pequeños para la tabla */
const btnBlueSmall = { ...btnBlue, padding: "5px 10px", fontSize: "12px" };
const btnRedSmall = { background: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: 6, fontSize: "12px", cursor: "pointer" };
const btnGreenSmall = { ...btnGreen, padding: "5px 10px", fontSize: "12px" };