import Constants from "expo-constants";

export const getApiBaseUrl = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  const localIP = debuggerHost ? debuggerHost.split(":")[0] : "localhost";
  return `http://${localIP}:8000`;
};

export const apiRequest = async (endpoint: string, method = "GET", body?: any, token?: string) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error: ${response.status} - ${errText}`);
  }

  return await response.json();
};