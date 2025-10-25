import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Ignorar avisos específicos, incluindo o aviso de depreciação do SafeAreaView
LogBox.ignoreLogs([
  "Warning: ...", 
  "SafeAreaView has been deprecated"
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
