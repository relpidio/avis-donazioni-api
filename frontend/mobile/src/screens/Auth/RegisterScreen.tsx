import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codiceFiscale, setCodiceFiscale] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !codiceFiscale) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        codice_fiscale: codiceFiscale,
        gdpr_consent: gdprConsent,
      });
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta AVIS</Text>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        placeholder="Sobrenome"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Codice Fiscale"
        style={styles.input}
        value={codiceFiscale}
        autoCapitalize="characters"
        onChangeText={setCodiceFiscale}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          Aceito o tratamento de dados (GDPR)
        </Text>
        <Switch
          value={gdprConsent}
          onValueChange={setGdprConsent}
          thumbColor={gdprConsent ? "#b30000" : "#ccc"}
          trackColor={{ true: "#ff9999", false: "#ccc" }}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registrando..." : "Registrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "#b30000",
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#b30000",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#b30000",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
