import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthData {
    token: string | null;
    rol: string | null;
    login: (token: string, rol: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthData>({} as AuthData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const navigate = useNavigate(); // 👈 ESTO FALTABA

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("access")
    );

    const [rol, setRol] = useState<string | null>(
        localStorage.getItem("rol")
    );

    const login = (token: string, rol: string) => {
        localStorage.setItem("access", token);
        localStorage.setItem("rol", rol);
        setToken(token);
        setRol(rol);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setRol(null);

        navigate("/login", { replace: true }); // ✅ navegación correcta SPA
    };

    return (
        <AuthContext.Provider value={{ token, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
