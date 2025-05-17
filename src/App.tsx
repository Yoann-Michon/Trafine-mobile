import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthScreen from './screens/AuthScreen';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import TomTomMapScreen from './screens/MapScreen';
import Layout from './components/Layout';
import Settings from './screens/SettingsScreen';
import TripsScreen from './screens/TripsScreen';
import ProfileScreen from './screens/ProfileScreen';

export type RootStackParamList = {
  Auth: undefined;
  Carte: {
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
    destination?: {
      latitude: number;
      longitude: number;
    };
    incidents?: any[];
    onMapReady?: () => void;
  };
  QRCodeScanner: undefined;
  Profile: undefined;
  Settings: undefined;
  Activity: undefined;
  Trips:undefined;
  Profil: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const ScreenWithLayout = ({ component: Component, title, ...rest }: any) => {
  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="Auth" 
            component={({ navigation, route }: any) => (
              <ScreenWithLayout 
                component={AuthScreen} 
                title="Authentification" 
                navigation={navigation} 
                route={route} 
              />
            )} 
          />
          <Stack.Screen 
            name="Profil" 
            component={({ navigation, route }: any) => (
              <ScreenWithLayout 
                component={ProfileScreen} 
                title="Profil" 
                navigation={navigation} 
                route={route} 
              />
            )} 
          />
          <Stack.Screen 
            name="Carte" 
            component={({ navigation, route }: any) => (
              <ScreenWithLayout 
                component={TomTomMapScreen} 
                title="Navigation" 
                navigation={navigation} 
                route={route} 
              />
            )} 
          />
          <Stack.Screen 
            name="Trips" 
            component={({ navigation, route }: any) => (
              <ScreenWithLayout 
                component={TripsScreen} 
                title="Trips" 
                navigation={navigation} 
                route={route} 
              />
            )} 
          />
          <Stack.Screen 
            name="Activity" 
            component={({ navigation, route }: any) => (
              <ScreenWithLayout 
                component={Settings} 
                title="Activity" 
                navigation={navigation} 
                route={route} 
              />
            )} 
          />
          <Stack.Screen 
            name="Settings" 
            component={({ navigation, route }: any) => (
              <ScreenWithLayout 
                component={Settings} 
                title="Parametres" 
                navigation={navigation} 
                route={route} 
              />
            )} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});