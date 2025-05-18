import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  const login = async (correo: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", { correo, password });
      localStorage.setItem("token", data.token);

      const { data: perfil } = await axiosInstance.get("/usuarios/perfil");
      localStorage.setItem("nombre", perfil.nombre || "");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch {
      alert("Credenciales inválidas");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
