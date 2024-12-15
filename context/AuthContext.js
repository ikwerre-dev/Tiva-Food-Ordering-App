import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
} from 'react-native';
export const ThemeContext = createContext();

export const AuthContext = createContext();

export default function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedTheme) setTheme(storedTheme);
    };
    loadData();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <StatusBar showHideTransition={true} hidden barStyle="light-content" />
        
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
