import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUserFromToken } from "../services/auth";

// Define proper types for user and registration data
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  codice_fiscale?: string;
  created_at?: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  codice_fiscale: string;
  gdpr_consent: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
  // Ainda guarda o token, mas não faz login automático
  console.log("Token encontrado, mas aguardando login manual.");
} else {
  console.log("Nenhum token salvo, login necessário.");
        }
      } catch (error) {
        console.warn("Falha ao carregar usuário:", error);
        setError("Não foi possível carregar os dados do usuário");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      const token = await apiLogin(email, password);
      if (!token) {
        throw new Error("Token de autenticação não recebido");
      }
      await AsyncStorage.setItem("token", JSON.stringify(token));
      const userData = await getUserFromToken(token);
      if (!userData) {
        throw new Error("Dados do usuário não encontrados");
      }
      setUser(userData);
    } catch (err: any) {
      console.error("Erro de login:", err);
      setError(err.message || "Falha ao fazer login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      clearError();
      const token = await apiRegister(data);
      if (!token) {
        throw new Error("Token de registro não recebido");
      }
      await AsyncStorage.setItem("token", JSON.stringify(token));
      const userData = await getUserFromToken(token);
      if (!userData) {
        throw new Error("Dados do usuário não encontrados após registro");
      }
      setUser(userData);
    } catch (err: any) {
      console.error("Erro de registro:", err);
      setError(err.message || "Falha ao registrar");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      clearError();
      await apiLogout();
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Falha ao fazer logout");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
