import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  isDark: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    card: string;
    border: string;
    error: string;
    success: string;
    inputBackground: string;
  };
}

const lightColors = {
  background: '#f9f9f9',
  text: '#333333',
  primary: '#b30000',
  secondary: '#4CAF50',
  card: '#ffffff',
  border: '#dddddd',
  error: '#e53935',
  success: '#2E7D32',
  inputBackground: '#ffffff',
};

const darkColors = {
  background: '#121212',
  text: '#f1f1f1',
  primary: '#ff4d4d',
  secondary: '#66bb6a',
  card: '#1e1e1e',
  border: '#444444',
  error: '#ef5350',
  success: '#4caf50',
  inputBackground: '#2c2c2c',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
  colors: lightColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  
  useEffect(() => {
    // Load saved theme from AsyncStorage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;