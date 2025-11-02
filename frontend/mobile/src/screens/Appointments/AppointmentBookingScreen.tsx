import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import * as Location from "expo-location";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { listCenters, getCenterAvailability, createAppointment, Center, Slot } from "../../services/appointments";
import { Ionicons } from "@expo/vector-icons";

export default function AppointmentBookingScreen() {
  const nav = useNavigation<any>();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async (query?: string) => {
    try {
      setLoadingCenters(true);
      const data = await listCenters(query);
      setCenters(data);
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Falha ao carregar centros.");
    } finally {
      setLoadingCenters(false);
    }
  };

  const useLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Ative a localização para encontrar centros próximos.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      await fetchCenters(`${loc.coords.latitude},${loc.coords.longitude}`);
    } catch (e: any) {
      Alert.alert("Erro", "Não foi possível usar sua localização.");
    }
  };

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
      <Text style={styles.h1}>Find a blood donation venue near you</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter a town, city or postal code"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => fetchCenters(search)}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.locationButton} onPress={useLocation}>
        <Ionicons name="location-outline" size={18} color="#007BFF" />
        <Text style={styles.locationText}>Use your location</Text>
      </TouchableOpacity>

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

      <Text style={[styles.h2, { marginTop: 12 }]}>Available time slots</Text>
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
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 16 }}>No available slots for this center.</Text>}
        />
      ) : (
        <Text style={{ marginTop: 8 }}>Select a center to view time slots.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#B00020", textAlign: "center" },
  h2: { fontSize: 16, fontWeight: "700", color: "#222" },
  searchContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10 },
  searchButton: { marginLeft: 8, backgroundColor: "#007BFF", borderRadius: 6, padding: 10 },
  locationButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 },
  locationText: { marginLeft: 5, color: "#007BFF", fontWeight: "600" },
  centerPill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 9999, backgroundColor: "#e9ecef" },
  centerPillActive: { backgroundColor: "#0066B3" },
  centerPillTxt: { color: "#222", fontWeight: "700" },
  slotCard: { padding: 14, borderRadius: 10, backgroundColor: "#f6f7f9", marginBottom: 10 },
  slotTxt: { fontWeight: "600", color: "#333" },
});