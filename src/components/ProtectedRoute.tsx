import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

interface Props {
    children: JSX.Element;
    roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
    const { token, rol } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roles && (!rol || !roles.includes(rol))) {
        return <Navigate to="/dashboard" replace />;
        // o "/no-autorizado" si luego lo creas
    }

    return children;
}
