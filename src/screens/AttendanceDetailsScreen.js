// src/screens/AttendanceDetailsScreen.js
import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// Import ThemeContext
import { ThemeContext } from '../context/ThemeContext';

// --- AttendanceDetailsScreen Component ---
export default function AttendanceDetailsScreen({ route }) {
  const { theme } = useContext(ThemeContext);
  const { employeeId, employeeName } = route.params;
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const STANDARD_START_TIME = '09:00';

  const loadAttendanceRecords = async () => {
    try {
      const storedData = await AsyncStorage.getItem('employeeData');
      if (storedData) {
        const employees = JSON.parse(storedData);
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee) {
          const sortedPunches = employee.punches.sort((a, b) =>
            moment(b.date).diff(moment(a.date))
          );
          setAttendanceRecords(sortedPunches);
        }
      }
    } catch (error) {
      console.error("Failed to load attendance records:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAttendanceRecords();
    }, [])
  );

  const getStatus = (punchIn, punchOut) => {
    if (punchIn && punchOut) {
      const punchInMoment = moment(punchIn, 'HH:mm');
      const standardStartMoment = moment(STANDARD_START_TIME, 'HH:mm');

      if (punchInMoment.isAfter(standardStartMoment)) {
        return { text: 'Late', color: theme.punchStatusLate };
      }
      return { text: 'Present', color: theme.punchStatusPresent };
    }
    if (!punchIn && !punchOut) {
      return { text: 'Absent', color: theme.punchStatusAbsent };
    }
    return { text: 'Incomplete', color: theme.punchStatusIncomplete };
  };

  const renderAttendanceItem = ({ item }) => {
    const status = getStatus(item.punchIn, item.punchOut);
    return (
      <View style={[styles.attendanceCard, { backgroundColor: theme.cardBackground, shadowColor: theme.cardShadow }]}>
        <Text style={[styles.attendanceDate, { color: theme.text }]}>{moment(item.date).format('MMMM DD, YYYY')}</Text>
        <View style={styles.punchTimes}>
          <Text style={[styles.punchTime, { color: theme.text }]}>Punch In: {item.punchIn || 'N/A'}</Text>
          <Text style={[styles.punchTime, { color: theme.text }]}>Punch Out: {item.punchOut || 'N/A'}</Text>
        </View>
        <Text style={[styles.statusText, { color: status.color }]}>Status: {status.text}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>{employeeName}'s Attendance Details</Text>
      {attendanceRecords.length > 0 ? (
        <FlatList
          data={attendanceRecords}
          renderItem={renderAttendanceItem}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={[styles.noRecordsText, { color: theme.text }]}>No attendance records found for this employee.</Text>
      )}
    </View>
  );
}

// --- StyleSheet Definitions for AttendanceDetailsScreen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  attendanceCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  attendanceDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  punchTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  punchTime: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
  noRecordsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
