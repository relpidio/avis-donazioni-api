import Constants from "expo-constants";
import { Platform } from "react-native";

export const getApiBaseUrl = (): string => {
  // Hardcoded solution for immediate testing
  // Replace with your computer's actual IP address that's accessible from your device
  return 'http://172.20.10.3:8000';
  
  /* 
  // More dynamic solution for future use
  try {
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    const localIP = debuggerHost ? debuggerHost.split(":")[0] : "localhost";
    
    console.log('Device IP detected as:', localIP);
    
    // Use the same IP as the Expo server is running on
    return `http://${localIP}:8000`;
  } catch (error) {
    console.warn("Error getting API base URL:", error);
    return 'http://172.20.10.3:8000'; // Fallback to hardcoded IP
  }
  */
};

export const apiRequest = async (endpoint: string, method = "GET", body?: any, token?: string) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options: RequestInit = { 
    method, 
    headers,
    // Add timeout handling
    timeout: 10000
  };
  if (body) options.body = JSON.stringify(body);

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, options);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${JSON.stringify(data)}`);
      // Handle specific error cases
      if (response.status === 500 && data.detail === "Not implemented") {
        throw new Error("Esta funcionalidade ainda não está implementada no servidor. Por favor, tente novamente mais tarde.");
      }
      throw new Error(`API error: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("Network request failed:", error);
    if (error instanceof TypeError && error.message.includes("Network request failed")) {
      throw new Error(`Não foi possível conectar ao servidor. Verifique sua conexão ou se o servidor está rodando em ${baseUrl}`);
    }
    throw error;
  }
};