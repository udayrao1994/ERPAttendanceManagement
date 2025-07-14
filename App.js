// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import ThemeProvider from the new context file
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

// Import screen components from their new locations
import HomeScreen from './src/screens/HomeScreen';
import PunchScreen from './src/screens/PunchScreen';
import AttendanceDetailsScreen from './src/screens/AttendanceDetailsScreen';

// --- Navigation Stack ---
const Stack = createStackNavigator();

// --- Main App Component ---
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={() => {
              // Access theme from context within the options function
              const { theme } = useContext(ThemeContext);
              return {
                title: 'Dashboard',
                headerStyle: { backgroundColor: theme.headerBackground },
                headerTintColor: theme.headerText,
                headerTitleStyle: { fontWeight: 'bold' },
              };
            }}
          />
          <Stack.Screen
            name="Punch"
            component={PunchScreen}
            options={() => {
              // Access theme from context within the options function
              const { theme } = useContext(ThemeContext);
              return {
                title: 'Punch In/Out',
                headerStyle: { backgroundColor: theme.headerBackground },
                headerTintColor: theme.headerText,
                headerTitleStyle: { fontWeight: 'bold' },
              };
            }}
          />
          <Stack.Screen
            name="AttendanceDetails"
            component={AttendanceDetailsScreen}
            options={() => {
              // Access theme from context within the options function
              const { theme } = useContext(ThemeContext);
              return {
                title: 'Attendance Details',
                headerStyle: { backgroundColor: theme.headerBackground },
                headerTintColor: theme.headerText,
                headerTitleStyle: { fontWeight: 'bold' },
              };
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
