// src/context/ThemeContext.js
import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch, Text, View, StyleSheet } from 'react-native'; // Import necessary components for ThemeProvider's internal use and styles

// --- Theme Context ---
// This context will provide the current theme object, dark mode status, and a function to toggle the theme.
export const ThemeContext = createContext();

// --- Theme Definitions ---
// Define the color palettes for light and dark modes.
export const lightTheme = {
  background: '#f8f8f8',
  text: '#333',
  headerBackground: '#007bff',
  headerText: '#fff',
  cardBackground: '#fff',
  cardShadow: '#000',
  buttonPrimary: '#007bff',
  buttonSuccess: '#28a745',
  buttonDanger: '#dc3545',
  buttonDisabled: '#cccccc',
  punchStatusText: '#555',
  punchStatusLate: '#ffc107',
  punchStatusPresent: '#28a745',
  punchStatusAbsent: '#dc3545',
  punchStatusIncomplete: '#6c757d',
  borderColor: '#ddd',
};

export const darkTheme = {
  background: '#333333',
  text: '#f8f8f8',
  headerBackground: '#1a1a1a',
  headerText: '#f8f8f8',
  cardBackground: '#444444',
  cardShadow: '#000',
  buttonPrimary: '#6a0dad', // A darker purple for primary actions
  buttonSuccess: '#218838', // Darker green
  buttonDanger: '#c82333', // Darker red
  buttonDisabled: '#666666',
  punchStatusText: '#ccc',
  punchStatusLate: '#ffeb3b', // Brighter yellow for dark mode
  punchStatusPresent: '#4caf50', // Brighter green
  punchStatusAbsent: '#ef5350', // Brighter red
  punchStatusIncomplete: '#9e9e9e',
  borderColor: '#555',
};

// --- ThemeProvider Component ---
// This component manages the theme state and provides it to its children.
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Determine the current theme based on the isDarkMode state.
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Load theme preference from AsyncStorage on app start.
  // This ensures the theme persists across app launches.
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePreference');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };
    loadThemePreference();
  }, []); // Empty dependency array means this effect runs once on mount.

  // Function to toggle the theme between light and dark mode.
  // It also saves the new preference to AsyncStorage.
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('themePreference', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    // Provide the theme object, dark mode status, and toggle function to all consumers.
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- ThemeToggle Component (Optional, for direct use in other screens if needed) ---
// This component can be used independently to render a theme toggle switch.
// It's included here for completeness but is used directly in HomeScreen in this setup.
export function ThemeToggle() {
  const { theme, isDarkMode, toggleTheme } = React.useContext(ThemeContext);

  return (
    <View style={themeToggleStyles.themeToggleContainer}>
      <Text style={[themeToggleStyles.themeToggleText, { color: theme.text }]}>Dark Mode</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDarkMode}
      />
    </View>
  );
}

// --- Styles for ThemeToggle (if used separately) ---
const themeToggleStyles = StyleSheet.create({
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleText: {
    marginRight: 10,
    fontSize: 16,
  },
});
