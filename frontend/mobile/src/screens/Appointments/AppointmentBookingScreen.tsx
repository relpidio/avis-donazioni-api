import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { listCenters, getCenterAvailability, createAppointment, Center, Slot } from "../../services/appointments";

export default function AppointmentBookingScreen() {
  const nav = useNavigation<any>();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await listCenters();
        setCenters(data);
      } catch (e: any) {
        Alert.alert("Erro", e?.message || "Falha ao carregar centros.");
      } finally {
        setLoadingCenters(false);
      }
    })();
  }, []);

  const loadSlots = async (center: Center) => {
    setSelectedCenter(center);
    setLoadingSlots(true);
    try {
      const s = await getCenterAvailability(center.id);
      setSlots(s);
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Falha ao carregar horários.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const createMut = useMutation({
    mutationFn: (slot: Slot) => createAppointment({ centerId: selectedCenter!.id, slotId: slot.id }),
    onSuccess: () => {
      Alert.alert("Sucesso", "Agendamento criado!", [{ text: "OK", onPress: () => nav.goBack() }]);
    },
    onError: (err: any) => {
      Alert.alert("Erro", err?.message || "Falha ao criar agendamento.");
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Escolha um centro AVIS</Text>

      {loadingCenters ? (
        <View style={styles.center}><ActivityIndicator /><Text>Carregando centros...</Text></View>
      ) : (
        <FlatList
          horizontal
          data={centers}
          keyExtractor={(c) => String(c.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.centerPill, selectedCenter?.id === item.id && styles.centerPillActive]}
              onPress={() => loadSlots(item)}
            >
              <Text style={[styles.centerPillTxt, selectedCenter?.id === item.id && { color: "#fff" }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          contentContainerStyle={{ paddingVertical: 6 }}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <Text style={[styles.h2, { marginTop: 12 }]}>Horários disponíveis</Text>
      {loadingSlots ? (
        <View style={styles.center}><ActivityIndicator /><Text>Buscando horários...</Text></View>
      ) : selectedCenter ? (
        <FlatList
          data={slots}
          keyExtractor={(s) => String(s.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.slotCard} onPress={() => createMut.mutate(item)}>
              <Text style={styles.slotTxt}>
                {dayjs(item.startTime).format("DD/MM/YYYY HH:mm")} - {dayjs(item.endTime).format("HH:mm")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 16 }}>Sem horários para este centro.</Text>}
        />
      ) : (
        <Text style={{ marginTop: 8 }}>Selecione um centro para ver os horários.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#222" },
  h2: { fontSize: 16, fontWeight: "700", color: "#222" },
  centerPill: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 9999,
    backgroundColor: "#e9ecef",
  },
  centerPillActive: { backgroundColor: "#0066B3" },
  centerPillTxt: { color: "#222", fontWeight: "700" },
  slotCard: { padding: 14, borderRadius: 10, backgroundColor: "#f6f7f9", marginBottom: 10 },
  slotTxt: { fontWeight: "600", color: "#333" },
});
