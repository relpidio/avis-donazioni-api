import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUserFromToken } from "../services/auth";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const userData = await getUserFromToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.warn("Falha ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const token = await apiLogin(email, password);
    await AsyncStorage.setItem("token", token);
    const userData = await getUserFromToken(token);
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    const token = await apiRegister(email, password);
    await AsyncStorage.setItem("token", token);
    const userData = await getUserFromToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await apiLogout();
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
