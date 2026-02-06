import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function Recibos() {
    const [tramites, setTramites] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/tramites/")
            .then(res => {
                // Solo trámites EN_PROCESO
                setTramites(
                    res.data.filter((t: any) => t.estatus === "EN_PROCESO")
                );
            })
            .catch(() => {
                alert("Error al cargar trámites");
            });
    }, []);

    const verRecibo = (tramiteId: number) => {
        navigate(`/recibo/${tramiteId}`);
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Módulo de Recibos</h2>

            {tramites.length === 0 && (
                <p>No hay trámites en proceso</p>
            )}

            {tramites.map(t => (
                <div
                    key={t.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: 15,
                        marginBottom: 10,
                        borderRadius: 6
                    }}
                >
                    <p>
                        <b>{t.numero_tramite}</b><br />
                        {t.nombre} {t.apellido_paterno} {t.apellido_materno}
                    </p>

                    <button
                        onClick={() => verRecibo(t.id)}
                        style={{
                            background: "#1976d2",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 5,
                            cursor: "pointer"
                        }}
                    >
                        Ver / Imprimir Recibo
                    </button>
                </div>
            ))}
        </div>
    );
}
