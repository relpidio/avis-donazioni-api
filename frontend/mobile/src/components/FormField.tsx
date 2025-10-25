import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();
  const hasError = touched && error;
  
  const styles = StyleSheet.create({
    fieldContainer: {
      marginBottom: 16,
      width: '100%',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
      color: colors.text,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
  });
  
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
        placeholderTextColor={colors.border}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
        keyboardType={field === 'email' ? 'email-address' : 'default'}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormField;