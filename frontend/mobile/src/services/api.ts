import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 🔹 Retorna a URL base da API
 * Usa IP local configurado manualmente como fallback
 */
export const getApiBaseUrl = (): string => {
  try {
    const debuggerHost =
      Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    const localIP = debuggerHost ? debuggerHost.split(":")[0] : "localhost";
    return `http://${localIP}:8000`;
  } catch (error) {
    console.warn("⚠️ Erro ao detectar IP, usando fallback");
    return "http://172.20.10.3:8000";
  }
};

/**
 * 🔹 Função principal para requisições genéricas
 */
export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string | null
) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 🔑 Normaliza o token JWT
  if (token) {
    try {
      const cleanToken =
        typeof token === "string" ? JSON.parse(token) : token;
      headers["Authorization"] = `Bearer ${cleanToken}`;
    } catch {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) options.body = JSON.stringify(body);

  console.log(`🔗 [${method}] ${url}`);
  if (token) console.log("🔑 Enviando token:", headers["Authorization"]);

  try {
    const response = await fetch(url, options);

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}:`, data);

      // 🔒 Se token inválido ou expirado, remove o token
      if (response.status === 401 || response.status === 403) {
        await AsyncStorage.removeItem("token");
        console.warn("⚠️ Token expirado ou inválido — removido do storage");
      }

      throw new Error(
        data?.detail || `Erro de API (${response.status}) em ${endpoint}`
      );
    }

    console.log(`✅ Resposta OK (${response.status})`);
    return data;
  } catch (error: any) {
    console.error("🌐 Falha de rede ou erro inesperado:", error.message);
    if (error.message.includes("Network request failed")) {
      throw new Error(
        `Não foi possível conectar à API (${baseUrl}). Verifique se o servidor está rodando.`
      );
    }
    throw error;
  }
};

/**
 * 🔹 Requisição autenticada (busca token automaticamente)
 */
export const authorizedRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = await AsyncStorage.getItem("token");
  const parsedToken = token ? JSON.parse(token) : null;
  return apiRequest(endpoint, method, body, parsedToken);
};

/**
 * 🔹 Helpers específicos para endpoints comuns
 * (pode expandir conforme o app cresce)
 */
export const getAppointments = async () => authorizedRequest("/appointments");

export const getDonationCenters = async () => authorizedRequest("/centers");

export const postAppointment = async (data: any) =>
  authorizedRequest("/appointments", "POST", data);