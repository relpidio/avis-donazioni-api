#!/bin/bash

# Cores para melhor visualização
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens de erro e sair
error_exit() {
  echo -e "${RED}❌ ERRO: $1${NC}" >&2
  exit 1
}

# Função para verificar se o comando foi executado com sucesso
check_success() {
  if [ $? -ne 0 ]; then
    error_exit "$1"
  fi
}

# Função para verificar dependências
check_dependency() {
  if ! command -v $1 &> /dev/null; then
    error_exit "$1 não encontrado. Por favor, instale $1 antes de continuar."
  fi
}

# Verificar dependências necessárias
echo -e "${BLUE}🔍 Verificando dependências...${NC}"
check_dependency node
check_dependency npm
check_dependency npx

# Configurar para sair em caso de erro
set -e

echo -e "${GREEN}🚀 [AVIS Setup] Configurando módulo de registro com validação e GDPR...${NC}"

# 1️⃣ Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências (Formik, Yup, AsyncStorage)...${NC}"
npx expo install @react-native-async-storage/async-storage
check_success "Falha ao instalar AsyncStorage"

npm install formik yup
check_success "Falha ao instalar Formik e Yup"

# 2️⃣ Criar estrutura de pastas (caso não existam)
echo -e "${YELLOW}📁 Verificando estrutura de pastas...${NC}"
mkdir -p src/screens/Auth
mkdir -p src/context
mkdir -p src/components
check_success "Falha ao criar estrutura de pastas"

# 3️⃣ Criar o arquivo RegisterScreen.tsx com conteúdo completo
echo -e "${YELLOW}📝 Criando tela RegisterScreen.tsx...${NC}"

# Verificar se o arquivo já existe para evitar sobrescrever
if [ -f "src/screens/Auth/RegisterScreen.tsx" ]; then
  echo -e "${BLUE}ℹ️ O arquivo RegisterScreen.tsx já existe. Deseja sobrescrevê-lo? (s/n)${NC}"
  read -r response
  if [[ ! "$response" =~ ^([sS])$ ]]; then
    echo -e "${YELLOW}⏭️ Pulando criação do RegisterScreen.tsx...${NC}"
    SKIP_REGISTER_SCREEN=true
  fi
fi

if [ "$SKIP_REGISTER_SCREEN" != "true" ]; then
cat <<'EOF' > src/screens/Auth/RegisterScreen.tsx
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

  return (
    <View style={styles.container}>
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
              onPress={() => navigation.navigate("Login")}
            >
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
EOF
fi

# 4️⃣ Criar o componente FormField.tsx
echo -e "${YELLOW}📝 Criando componente FormField.tsx...${NC}"

# Verificar se o arquivo já existe
if [ -f "src/components/FormField.tsx" ]; then
  echo -e "${BLUE}ℹ️ O componente FormField.tsx já existe. Deseja sobrescrevê-lo? (s/n)${NC}"
  read -r response
  if [[ ! "$response" =~ ^([sS])$ ]]; then
    echo -e "${YELLOW}⏭️ Pulando criação do FormField.tsx...${NC}"
    SKIP_FORM_FIELD=true
  fi
fi

if [ "$SKIP_FORM_FIELD" != "true" ]; then
cat <<'EOF' > src/components/FormField.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormFieldProps {
  field: string;
  label: string;
  value: string;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  label,
  value,
  error,
  touched,
  secureTextEntry = false,
  placeholder,
  onChangeText,
  onBlur,
}) => {
  const hasError = touched && error;
  
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
        keyboardType={field === 'email' ? 'email-address' : 'default'}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
    marginTop: 4,
  },
});

export default FormField;
EOF
fi

echo -e "${GREEN}✅ Configuração do módulo de registro concluída com sucesso!${NC}"
echo -e "${BLUE}ℹ️ Você pode agora importar o RegisterScreen em seu navegador.${NC}"
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";

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

  return (
    <View style={styles.container}>
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
    fontSize: 26,
    color: "#b30000",
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
EOF

echo "✅ Tela de registro criada e dependências instaladas com sucesso!"
echo "Para testar, execute:"
echo "  cd ~/Avis_App/frontend/mobile && npx expo start -c"

