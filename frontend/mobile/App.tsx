import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignorar avisos específicos

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
