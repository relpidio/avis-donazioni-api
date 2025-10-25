import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { apiRequest } from "./api";

export interface AuthUser {
  email: string;
  name?: string;
}

export const login = async (email: string, password: string) => {
  const data = await apiRequest("/auth/login", "POST", { email, password });
  await AsyncStorage.setItem("token", data.access_token);
  return data;
};

export const register = async (data: any) => {
  // Send the data directly without nesting it under 'name'
  const response = await apiRequest("/auth/register", "POST", data);
  await AsyncStorage.setItem("token", response.access_token);
  return response;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const getUserFromToken = async (): Promise<AuthUser | null> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return { email: decoded.sub || decoded.email, name: decoded.name };
  } catch {
    return null;
  }
};