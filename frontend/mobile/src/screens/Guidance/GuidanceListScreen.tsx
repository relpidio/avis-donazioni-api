import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import HeaderLogo from "../../components/HeaderLogo";
import { colors } from "../../theme/colors";

export default function GuidanceListScreen() {
  return (
    <ScrollView style={styles.container}>
      <HeaderLogo />
      <Text style={styles.title}>Guidance</Text>
      <Text style={styles.subtitle}>
        Helpful guides and information about donating blood
      </Text>

      {[
        "Eligibility guidance",
        "Coronavirus guidance",
        "Check you can donate",
        "Health, medications and lifestyle",
        "Donating after trips abroad",
        "Preparing to give blood",
        "Giving blood for the first time",
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.linkBox}>
          <Text style={styles.link}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "700", color: colors.primary, marginTop: 15 },
  subtitle: { fontSize: 16, color: "#555", marginVertical: 10 },
  linkBox: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 6,
    marginVertical: 6,
  },
  link: { color: colors.secondary, fontWeight: "600" },
});
