import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Formik } from "formik";
import * as Yup from "yup";
import FormField from "../../components/FormField";

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
  const { register, error } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();
  const [savedConsent, setSavedConsent] = useState(false);

  useEffect(() => {
    const loadConsent = async () => {
      const saved = await AsyncStorage.getItem("gdpr_consent");
      if (saved === "true") setSavedConsent(true);
    };
    loadConsent();
  }, []);

  const handleSaveConsent = async (value: boolean) => {
    setSavedConsent(value);
    await AsyncStorage.setItem("gdpr_consent", value.toString());
  };

  const handleSubmitForm = async (values: any, { setSubmitting }: any) => {
    try {
      await register(values);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao criar conta.");
    } finally {
      setSubmitting(false);
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
          <ScrollView style={styles.formContainer}>
            <FormField
              field="first_name"
              label="Nome"
              value={values.first_name}
              error={errors.first_name}
              touched={touched.first_name}
              onChangeText={handleChange("first_name")}
              onBlur={handleBlur("first_name")}
              placeholder="Seu nome"
            />
            
            <FormField
              field="last_name"
              label="Sobrenome"
              value={values.last_name}
              error={errors.last_name}
              touched={touched.last_name}
              onChangeText={handleChange("last_name")}
              onBlur={handleBlur("last_name")}
              placeholder="Seu sobrenome"
            />

            <FormField
              field="email"
              label="E-mail"
              value={values.email}
              error={errors.email}
              touched={touched.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="seu.email@exemplo.com"
            />

            <FormField
              field="password"
              label="Senha"
              value={values.password}
              error={errors.password}
              touched={touched.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
              placeholder="Mínimo de 6 caracteres"
            />

            <FormField
              field="codice_fiscale"
              label="Codice Fiscale"
              value={values.codice_fiscale}
              error={errors.codice_fiscale}
              touched={touched.codice_fiscale}
              onChangeText={handleChange("codice_fiscale")}
              onBlur={handleBlur("codice_fiscale")}
              placeholder="16 caracteres"
            />

            <View style={styles.switchContainer}>
              <Switch
                value={values.gdpr_consent}
                onValueChange={(value) => {
                  setFieldValue("gdpr_consent", value);
                  handleSaveConsent(value);
                }}
                trackColor={{ false: "#d1d1d1", true: "#4CAF50" }}
                thumbColor={values.gdpr_consent ? "#2E7D32" : "#f4f3f4"}
              />
              <Text style={styles.switchLabel}>
                Concordo com os termos de uso e política de privacidade
              </Text>
            </View>
            {touched.gdpr_consent && errors.gdpr_consent && (
              <Text style={styles.error}>{errors.gdpr_consent}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Registrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#b30000",
  },
  error: {
    color: "#e53935",
    marginBottom: 10,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  switchLabel: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#b30000",
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
    backgroundColor: "#d32f2f",
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
    color: "#b30000",
    fontSize: 16,
    textAlign: "center",
  },
});
