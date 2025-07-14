import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { ThemeContext } from '../context/ThemeContext';

export default function PunchScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { employeeId, employeeName } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [punchStatus, setPunchStatus] = useState('');
  const [lastPunchTime, setLastPunchTime] = useState(null);

  const checkPunchStatus = async () => {
    try {
      const storedData = await AsyncStorage.getItem('employeeData');
      let employees = storedData ? JSON.parse(storedData) : [];

      let employee = employees.find(emp => emp.id === employeeId);

      if (!employee) {
        // Create new employee if not found
        employee = {
          id: employeeId,
          name: employeeName,
          punches: [],
        };
        employees.push(employee);
        await AsyncStorage.setItem('employeeData', JSON.stringify(employees));
      }

      const today = moment().format('YYYY-MM-DD');
      const todaysPunch = employee.punches.find(p => p.date === today);

      if (todaysPunch) {
        if (todaysPunch.punchIn && !todaysPunch.punchOut) {
          setPunchStatus('in');
          setLastPunchTime(todaysPunch.punchIn);
        } else if (todaysPunch.punchIn && todaysPunch.punchOut) {
          setPunchStatus('completed');
          setLastPunchTime(todaysPunch.punchOut);
        } else {
          setPunchStatus('');
          setLastPunchTime(null);
        }
      } else {
        setPunchStatus('');
        setLastPunchTime(null);
      }

      console.log("Current punchStatus:", punchStatus);
    } catch (error) {
      console.error("Error checking punch status:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkPunchStatus();
      setSelectedImage(null);
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please grant media library permissions to select an image.');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePunch = async (type) => {
    if (!selectedImage) {
      Alert.alert('Image Required', 'Please select an image to simulate face scan.');
      return;
    }

    const now = moment().format('HH:mm');
    const today = moment().format('YYYY-MM-DD');

    try {
      const storedData = await AsyncStorage.getItem('employeeData');
      let employees = storedData ? JSON.parse(storedData) : [];

      const employeeIndex = employees.findIndex(emp => emp.id === employeeId);

      if (employeeIndex !== -1) {
        const employee = employees[employeeIndex];
        let todaysPunchIndex = employee.punches.findIndex(p => p.date === today);

        if (type === 'punchIn') {
          if (todaysPunchIndex !== -1 && employee.punches[todaysPunchIndex].punchIn) {
            Alert.alert('Already Punched In', 'You have already punched in today.');
            return;
          }
          if (todaysPunchIndex === -1) {
            employee.punches.unshift({ date: today, punchIn: now, punchOut: null });
          } else {
            employee.punches[todaysPunchIndex].punchIn = now;
          }
          setPunchStatus('in');
          setLastPunchTime(now);
          Alert.alert('Success', `Punched In at ${now}`);
        } else if (type === 'punchOut') {
          if (todaysPunchIndex === -1 || !employee.punches[todaysPunchIndex].punchIn) {
            Alert.alert('Error', 'Please Punch In first before Punching Out.');
            return;
          }
          if (employee.punches[todaysPunchIndex].punchOut) {
            Alert.alert('Already Punched Out', 'You have already punched out today.');
            return;
          }
          employee.punches[todaysPunchIndex].punchOut = now;
          setPunchStatus('out');
          setLastPunchTime(now);
          Alert.alert('Success', `Punched Out at ${now}`);
        }

        employees[employeeIndex] = employee;
        await AsyncStorage.setItem('employeeData', JSON.stringify(employees));
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error handling punch:", error);
      Alert.alert('Error', 'Failed to record punch. Please try again.');
    }
  };

  return (
    <View style={[styles.punchContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.punchHeader, { color: theme.text }]}>Punch In/Out for {employeeName}</Text>

      <View style={styles.imageSelectionContainer}>
        <View style={styles.imageButtons}>
          <Button title="Select Image from Gallery" onPress={pickImage} color={theme.buttonPrimary} />
        </View>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={[styles.selectedImage, { borderColor: theme.borderColor }]} />
        )}
      </View>

      <View style={styles.punchButtonsRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: (!selectedImage || punchStatus === 'in' || punchStatus === 'completed') ? theme.buttonDisabled : theme.buttonSuccess }
          ]}
          onPress={() => handlePunch('punchIn')}
          disabled={!selectedImage || punchStatus === 'in' || punchStatus === 'completed'}
        >
          <Text style={styles.actionButtonText}>Punch In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: (!selectedImage || punchStatus !== 'in' || punchStatus === 'completed') ? theme.buttonDisabled : theme.buttonDanger }
          ]}
          onPress={() => handlePunch('punchOut')}
          disabled={!selectedImage || punchStatus !== 'in' || punchStatus === 'completed'}
        >
          <Text style={styles.actionButtonText}>Punch Out</Text>
        </TouchableOpacity>
      </View>

      {punchStatus === 'in' && lastPunchTime && (
        <Text style={[styles.punchStatusText, { color: theme.punchStatusText }]}>
          Currently Punched In since: {lastPunchTime}
        </Text>
      )}
      {punchStatus === 'out' && lastPunchTime && (
        <Text style={[styles.punchStatusText, { color: theme.punchStatusText }]}>
          Last Punched Out at: {lastPunchTime}
        </Text>
      )}
      {punchStatus === 'completed' && (
        <Text style={[styles.punchStatusText, { color: theme.punchStatusText }]}>
          You have completed your punches for today.
        </Text>
      )}

      <Text style={{ marginTop: 10, color: theme.text }}>Current Status: {punchStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  punchContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  punchHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  imageSelectionContainer: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  imageButtons: {
    width: '80%',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
    borderWidth: 3,
  },
  punchButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  punchStatusText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
