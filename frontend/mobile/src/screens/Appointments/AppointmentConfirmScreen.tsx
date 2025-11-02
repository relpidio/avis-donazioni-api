import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getApiBaseUrl } from "../../services/api";

export default function AppointmentConfirmScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { center } = route.params;
  const baseUrl = getApiBaseUrl();

  const handleConfirm = async () => {
    try {
      const res = await fetch(`${baseUrl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_id: "TEST_USER",
          center_id: String(center.id),
          slot_id: "DEFAULT_SLOT",
          date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar agendamento");
      Alert.alert("✅ Agendamento confirmado!", `Você agendou no centro ${center.name}`);
      nav.navigate("AppointmentsList");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível confirmar o agendamento.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm appointment</Text>
      <Text style={styles.centerName}>{center.name}</Text>
      <Text style={styles.centerAddress}>{center.address}</Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#B00020", marginBottom: 20 },
  centerName: { fontSize: 18, fontWeight: "600", color: "#222", textAlign: "center" },
  centerAddress: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 30 },
  button: { backgroundColor: "#B00020", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
});