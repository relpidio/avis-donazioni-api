import React from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Appointment } from "../../services/appointments";

type Param = { appt: Appointment };

export default function AppointmentDetailsScreen() {
  const route = useRoute<RouteProp<Record<string, Param>, string>>();
  const appt = route.params?.appt;

  if (!appt) {
    return (
      <View style={styles.center}>
        <Text>Agendamento não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{appt.centerName || `Centro #${appt.centerId}`}</Text>
      <Text style={styles.field}>Início: {dayjs(appt.startTime).format("DD/MM/YYYY HH:mm")}</Text>
      <Text style={styles.field}>Fim: {dayjs(appt.endTime).format("HH:mm")}</Text>
      <Text style={styles.field}>Status: {appt.status || "scheduled"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#222" },
  field: { marginBottom: 6, color: "#333" },
});
