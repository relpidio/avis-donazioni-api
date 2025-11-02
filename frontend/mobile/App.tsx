import React from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import { QueryProvider } from "./src/providers/QueryProvider";
import AppNavigator from "./src/navigation/AppNavigator";

// Ignorar avisos específicos
LogBox.ignoreLogs([
  "Warning: ...", 
  "SafeAreaView has been deprecated"
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <QueryProvider>
            <AppNavigator />
          </QueryProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}