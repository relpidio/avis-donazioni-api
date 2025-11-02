import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HeaderLogo from "../../components/HeaderLogo";
import { colors } from "../../theme/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <HeaderLogo />
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  text: { fontSize: 20, color: colors.primary, fontWeight: "bold" },
});
