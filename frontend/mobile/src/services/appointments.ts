import Constants from "expo-constants";

export interface Slot {
  id: string | number;
  startTime: string; // ISO
  endTime: string;   // ISO
}

export interface Appointment {
  id: string | number;
  centerId: string | number;
  centerName?: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  status?: "scheduled" | "cancelled" | string;
}

function guessBaseUrl(): string {
  // Detecta seu IP/LAN em desenvolvimento (Expo) e cai no localhost se necessário
  const expoExtra: any = Constants?.expoConfig?.extra || Constants?.manifest?.extra;
  if (expoExtra?.API_BASE_URL) return expoExtra.API_BASE_URL;
  const debuggerHost = (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost
    || (Constants as any)?.manifest?.debuggerHost;
  if (debuggerHost) {
    const host = String(debuggerHost).split(":")[0];
    return `http://${host}:8000`;
  }
  return "http://127.0.0.1:8000";
}

const BASE = guessBaseUrl();

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

// --- Endpoints ---

export async function listAppointments(): Promise<Appointment[]> {
  // GET /appointments
  return http<Appointment[]>("/appointments");
}

export async function createAppointment(payload: {
  centerId: string | number;
  slotId: string | number;
}): Promise<Appointment> {
  // POST /appointments
  return http<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelAppointment(appointmentId: string | number): Promise<{ success: boolean }> {
  // DELETE /appointments/{appointmentId}
  return http<{ success: boolean }>(`/appointments/${appointmentId}`, { method: "DELETE" });
}

export async function getCenterAvailability(centerId: string | number): Promise<Slot[]> {
  // GET /centers/{centerId}/availability
  return http<Slot[]>(`/centers/${centerId}/availability`);
}

// Aux: lista centros (reuso simples para booking)
export interface Center {
  id: string | number;
  name: string;
  city?: string;
  address?: string;
}
export async function listCenters(): Promise<Center[]> {
  return http<Center[]>("/centers");
}
