import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo animado */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 1500 }}
        style={styles.logoContainer}
      >
        <Image
          source={require("../../assets/avis_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </MotiView>

      {/* Cacho de uva em formato de coração */}
      <MotiView
        from={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 2000 }}
        style={styles.heartContainer}
      >
        <Image
          source={require("../../assets/grape_heart.png")}
          style={styles.heart}
          resizeMode="contain"
        />
      </MotiView>

      <Text style={styles.title}>Unisciti a noi nel salvare vite</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login" as never)}
      >
        <Text style={styles.loginText}>Accedi</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
        <Text style={styles.signupText}>Registrati per donare</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 120,
  },
  heartContainer: {
    marginBottom: 30,
  },
  heart: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    color: "#2c2c2c",
  },
  loginButton: {
    backgroundColor: "#0066B3", // Azul AVIS
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: "#0066B3",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
