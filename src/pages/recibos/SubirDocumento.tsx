import { useState } from "react";
import api from "../../api/api";

interface Props {
    tramiteId: number;
}

export default function SubirDocumento({ tramiteId }: Props) {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [tipo, setTipo] = useState("REQUISITO");
    const [mensaje, setMensaje] = useState("");

    const subir = async () => {
        if (!archivo) {
            setMensaje("Selecciona un archivo");
            return;
        }

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("tipo", tipo);

        try {
            await api.post(
                `/tramites/${tramiteId}/documentos/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMensaje("✅ Documento subido correctamente");
            setArchivo(null);

        } catch (error: any) {
            console.log(error.response?.data);
            setMensaje("❌ Error al subir documento");
        }
    };

    return (
        <div>
            <h4>Subir documento</h4>

            <select value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="REQUISITO">Requisito</option>
                <option value="FINAL">Documento final</option>
            </select>

            <input
                type="file"
                onChange={e =>
                    setArchivo(e.target.files?.[0] || null)
                }
            />

            <button onClick={subir}>Subir</button>

            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}
