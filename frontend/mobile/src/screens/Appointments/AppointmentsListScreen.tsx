import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listAppointments, cancelAppointment, Appointment } from "../../services/appointments";

export default function AppointmentsListScreen() {
  const nav = useNavigation<any>();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["appointments"],
    queryFn: listAppointments,
  });

  const cancelMut = useMutation({
    mutationFn: (id: string | number) => cancelAppointment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err: any) => {
      Alert.alert("Erro", err?.message || "Falha ao cancelar agendamento.");
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando agendamentos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar seus agendamentos.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Appointment }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.centerName || `Centro #${item.centerId}`}</Text>
        <Text style={styles.sub}>
          {dayjs(item.startTime).format("DD/MM/YYYY HH:mm")} - {dayjs(item.endTime).format("HH:mm")}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.navigate("AppointmentDetails", { appt: item })}>
            <Text style={styles.btnSecondaryTxt}>Detalhes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnDanger}
            onPress={() =>
              Alert.alert("Cancelar", "Deseja cancelar este agendamento?", [
                { text: "Não" },
                { text: "Sim", onPress: () => cancelMut.mutate(item.id) },
              ])
            }
          >
            <Text style={styles.btnDangerTxt}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => nav.navigate("AppointmentBooking")}>
        <Text style={styles.btnPrimaryTxt}>Agendar nova doação</Text>
      </TouchableOpacity>

      <FlatList
        data={data || []}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 24 }}>Você ainda não possui agendamentos.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  card: { backgroundColor: "#f6f7f9", borderRadius: 12, padding: 14, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "700", color: "#222" },
  sub: { marginTop: 4, color: "#555" },
  row: { flexDirection: "row", marginTop: 12, gap: 10 },
  btnPrimary: { backgroundColor: "#0066B3", padding: 14, borderRadius: 10, marginBottom: 16 },
  btnPrimaryTxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
  btnDanger: { backgroundColor: "#d9534f", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnDangerTxt: { color: "#fff", fontWeight: "700" },
  btnSecondary: { backgroundColor: "#e9ecef", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnSecondaryTxt: { color: "#222", fontWeight: "700" },
});
