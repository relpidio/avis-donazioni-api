import React from "react";
import { View, Image, Text, StyleSheet, Platform } from "react-native";
import { colors } from "../theme/colors";

export default function HeaderLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/avis_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>AVIS Donatori di Sangue</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    // se quiser dar margem extra superior no iOS
    paddingTop: Platform.OS === "ios" ? 40 : 16,
    backgroundColor: colors.background,
  },
  logo: {
    width: 65,     // aumenta largura
    height: 65,    // aumenta altura
    marginRight: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
});