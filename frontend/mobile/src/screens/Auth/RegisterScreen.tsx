import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";

// ✅ Validação do formulário
const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required("Nome é obrigatório"),
  last_name: Yup.string().required("Sobrenome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string().min(6, "Mínimo de 6 caracteres").required("Senha é obrigatória"),
  codice_fiscale: Yup.string()
    .length(16, "Codice Fiscale deve ter 16 caracteres")
    .required("Codice Fiscale é obrigatório"),
  gdpr_consent: Yup.boolean().oneOf([true], "É necessário aceitar o GDPR"),
});

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [savedConsent, setSavedConsent] = useState(false);

  // 🔄 Carregar consentimento salvo
  useEffect(() => {
    const loadConsent = async () => {
      const saved = await AsyncStorage.getItem("gdpr_consent");
      if (saved === "true") setSavedConsent(true);
    };
    loadConsent();
  }, []);

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    formContainer: {
      width: '100%',
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      textAlign: "center",
      color: colors.primary,
    },
    error: {
      color: colors.error,
      marginBottom: 10,
      fontSize: 14,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchLabel: {
      marginLeft: 12,
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    linkButton: {
      alignItems: "center",
      padding: 12,
    },
    linkText: {
      color: colors.primary,
      fontSize: 16,
      textAlign: "center",
    },
    themeToggle: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      zIndex: 10,
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text>{isDark ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Criar Conta AVIS</Text>

      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          codice_fiscale: "",
          gdpr_consent: savedConsent,
        }}
        enableReinitialize
        validationSchema={RegisterSchema}
        onSubmit={handleSubmitForm}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
        }) => (
          <>
            <TextInput
              placeholder="Nome"
              style={styles.input}
              value={values.first_name}
              onChangeText={handleChange("first_name")}
              onBlur={handleBlur("first_name")}
            />
            {touched.first_name && errors.first_name && (
              <Text style={styles.error}>{errors.first_name}</Text>
            )}

            <TextInput
              placeholder="Sobrenome"
              style={styles.input}
              value={values.last_name}
              onChangeText={handleChange("last_name")}
              onBlur={handleBlur("last_name")}
            />
            {touched.last_name && errors.last_name && (
              <Text style={styles.error}>{errors.last_name}</Text>
            )}

            <TextInput
              placeholder="E-mail"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Senha"
              style={styles.input}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TextInput
              placeholder="Codice Fiscale"
              style={styles.input}
              value={values.codice_fiscale}
              autoCapitalize="characters"
              onChangeText={handleChange("codice_fiscale")}
              onBlur={handleBlur("codice_fiscale")}
            />
            {touched.codice_fiscale && errors.codice_fiscale && (
              <Text style={styles.error}>{errors.codice_fiscale}</Text>
            )}

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Aceito o tratamento de dados (GDPR)
              </Text>
              <Switch
                value={values.gdpr_consent}
                onValueChange={(val) => {
                  setFieldValue("gdpr_consent", val);
                  handleSaveConsent(val);
                }}
                thumbColor={values.gdpr_consent ? "#b30000" : "#ccc"}
                trackColor={{ true: "#ff9999", false: "#ccc" }}
              />
            </View>
            {touched.gdpr_consent && errors.gdpr_consent && (
              <Text style={styles.error}>{errors.gdpr_consent}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, isSubmitting && { opacity: 0.7 }]}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Já tem conta? Entrar</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fdfdfd",
  },
  button: {
    backgroundColor: "#b30000",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#b30000",
    textAlign: "center",
    marginTop: 14,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 6,
  },
});
