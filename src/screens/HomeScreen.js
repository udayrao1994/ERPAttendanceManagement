// src/screens/HomeScreen.js
import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch, // Import Switch for the theme toggle
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect } from 'react';

// Import ThemeContext and initialEmployeeData
import { ThemeContext } from '../context/ThemeContext';
import { initialEmployeeData } from '../../data/data';

// --- HomeScreen Component ---
export default function HomeScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [employees, setEmployees] = useState([]);


  useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        <Text style={{ color: theme.text, marginRight: 8, fontSize: 14 }}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={isDarkMode}
        />
      </View>
    ),
  });
}, [navigation, isDarkMode, theme]);

  // Function to load employee data from AsyncStorage
  const loadEmployeeData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('employeeData');
      if (storedData) {
        setEmployees(JSON.parse(storedData));
      } else {
        // If no data, use initial dummy data and save it
        setEmployees(initialEmployeeData);
        await AsyncStorage.setItem('employeeData', JSON.stringify(initialEmployeeData));
      }
    } catch (error) {
      console.error("Failed to load employee data from AsyncStorage:", error);
      // Fallback to initial data if loading fails
      setEmployees(initialEmployeeData);
    }
  };

  // Use useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadEmployeeData();
    }, [])
  );

  // Render item for FlatList on HomeScreen
  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.employeeCard, { backgroundColor: theme.cardBackground, shadowColor: theme.cardShadow }]}
      onPress={() => navigation.navigate('AttendanceDetails', { employeeId: item.id, employeeName: item.name })}
    >
      <Text style={[styles.employeeName, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.employeeDepartment, { color: theme.text }]}>{item.department}</Text>
      <TouchableOpacity
        style={[styles.punchButton, { backgroundColor: theme.buttonPrimary }]}
        onPress={() => navigation.navigate('Punch', { employeeId: item.id, employeeName: item.name })}
      >
        <Text style={styles.punchButtonText}>Punch In/Out</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.text }]}>Employee Attendance Dashboard</Text>
        {/* <View style={styles.themeToggleContainer}>
          <Text style={{ color: theme.text, marginRight: 10 }}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View> */}
      </View>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

// --- StyleSheet Definitions for HomeScreen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Allow header text to take available space
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  employeeCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  employeeDepartment: {
    fontSize: 14,
    marginTop: 5,
  },
  punchButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  punchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
