import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {

    const { token } = useAuth();

    // Si ya está logueado → mandarlo al dashboard
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
