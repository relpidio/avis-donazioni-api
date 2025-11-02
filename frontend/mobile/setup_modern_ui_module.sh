#!/usr/bin/env bash
set -e

echo "🩸 Configurando módulo de interface moderna AVIS..."

PROJECT_ROOT="$HOME/Avis_App/frontend/mobile/src"

# === 1️⃣ Criar estrutura de pastas ===
echo "📁 Criando estrutura de diretórios..."
mkdir -p "$PROJECT_ROOT/navigation"
mkdir -p "$PROJECT_ROOT/screens/Appointments"
mkdir -p "$PROJECT_ROOT/screens/Guidance"
mkdir -p "$PROJECT_ROOT/screens/Profile"
mkdir -p "$PROJECT_ROOT/screens/Settings"
mkdir -p "$PROJECT_ROOT/components"
mkdir -p "$PROJECT_ROOT/theme"

# === 2️⃣ Instalar dependências ===
echo "📦 Instalando dependências Expo e ícones..."
cd "$HOME/Avis_App/frontend/mobile"
npx expo install @react-navigation/bottom-tabs react-native-vector-icons react-native-safe-area-context >/dev/null

# === 3️⃣ Criar tema ===
if [ ! -f "$PROJECT_ROOT/theme/colors.ts" ]; then
cat <<'EOF' > "$PROJECT_ROOT/theme/colors.ts"
export const colors = {
  primary: "#C8102E", // vermelho AVIS
  secondary: "#004B87", // azul AVIS
  background: "#FFFFFF",
  lightGray: "#F8F8F8",
  text: "#222222",
};
EOF
echo "🎨 Arquivo colors.ts criado."
fi

# === 4️⃣ Componente de logo ===
if [ ! -f "$PROJECT_ROOT/components/HeaderLogo.tsx" ]; then
cat <<'EOF' > "$PROJECT_ROOT/components/HeaderLogo.tsx"
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function HeaderLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/avis_logo.png")}
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
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
});
EOF
echo "🩸 Componente HeaderLogo.tsx criado."
fi

# === 5️⃣ Navegação principal por abas ===
cat <<'EOF' > "$PROJECT_ROOT/navigation/TabNavigator.tsx"
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import AppointmentsListScreen from "../screens/Appointments/AppointmentsListScreen";
import GuidanceListScreen from "../screens/Guidance/GuidanceListScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";
          if (route.name === "Home") iconName = "home-outline";
          if (route.name === "Appointments") iconName = "calendar-outline";
          if (route.name === "Guidance") iconName = "medkit-outline";
          if (route.name === "Profile") iconName = "person-outline";
          if (route.name === "Settings") iconName = "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsListScreen} />
      <Tab.Screen name="Guidance" component={GuidanceListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
EOF

# === 6️⃣ Navegador principal AppNavigator ===
cat <<'EOF' > "$PROJECT_ROOT/navigation/AppNavigator.tsx"
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
EOF

# === 7️⃣ Tela Home principal ===
cat <<'EOF' > "$PROJECT_ROOT/screens/HomeScreen.tsx"
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <HeaderLogo />
      <Text style={styles.welcome}>Welcome, Rodrigo</Text>
      <Text style={styles.info}>Blood group: A+</Text>
      <Text style={styles.info}>Donation type: Blood</Text>
      <Text style={styles.info}>Donation credits: 3</Text>

      <Text style={styles.sectionTitle}>Appointments</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Book an appointment</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Essential information</Text>
      <TouchableOpacity style={styles.linkBox}>
        <Text style={styles.link}>Check you can donate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkBox}>
        <Text style={styles.link}>Your blood group</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkBox}>
        <Text style={styles.link}>Your donation history</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  welcome: { fontSize: 22, fontWeight: "700", color: colors.primary, marginTop: 10 },
  info: { fontSize: 16, color: colors.text, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: colors.text, marginTop: 20 },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  linkBox: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 6,
    marginVertical: 5,
  },
  link: { color: colors.secondary, fontWeight: "600" },
});
EOF

# === 8️⃣ Guidance Screen ===
cat <<'EOF' > "$PROJECT_ROOT/screens/Guidance/GuidanceListScreen.tsx"
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
EOF

# === 9️⃣ Telas Profile e Settings simples ===
for SCREEN in Profile Settings; do
cat <<EOF > "$PROJECT_ROOT/screens/${SCREEN}/${SCREEN}Screen.tsx"
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HeaderLogo from "../../components/HeaderLogo";
import { colors } from "../../theme/colors";

export default function ${SCREEN}Screen() {
  return (
    <View style={styles.container}>
      <HeaderLogo />
      <Text style={styles.text}>${SCREEN} Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  text: { fontSize: 20, color: colors.primary, fontWeight: "bold" },
});
EOF
done

echo "✅ Interface moderna AVIS instalada com sucesso!"
