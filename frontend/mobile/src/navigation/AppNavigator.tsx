import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

//Telas de autentição 
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

//Tab principal
import TabNavigator from "./TabNavigator";

//Telas de agendamentos
import AppointmentConfirmScreen from "../screens/Appointments/AppointmentConfirmScreen";
import AppointmentBookingScreen from "../screens/Appointments/AppointmentBookingScreen";
import AppointmentsListScreen from "../screens/Appointments/AppointmentsListScreen";
import AppointmentDetailsScreen from "../screens/Appointments/AppointmentDetailsScreen";

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
          <>
            {/* 🧭 Tab principal com Home */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />

            {/* 🩸 Telas de agendamento globais */}
            <Stack.Screen name="AppointmentConfirm"component={AppointmentConfirmScreen} />
            <Stack.Screen name="AppointmentBooking"component={AppointmentBookingScreen}
            options={{ headerShown: true, title: "Book Appointment" }}/>
            <Stack.Screen name="AppointmentsList"component={AppointmentsListScreen}
            options={{ title: "My Appointments" }}/>
            <Stack.Screen name="AppointmentDetails"component={AppointmentDetailsScreen}
            options={{ headerShown: true, title: "Appointment Details"}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
