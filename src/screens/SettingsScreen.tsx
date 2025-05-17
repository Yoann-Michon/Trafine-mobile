// screens/Settings.tsx
import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import SettingNavItem from '../components/settings/NavItem';
import SettingSection from '../components/settings/Section';
import SettingToggle from '../components/settings/Toggle';

export const appColors = {
  primary: '#0070f3',
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  error: '#ff5252',
};

const useAuth = () => {
  const navigation = useNavigation();
  
  return {
    logout: () => {
      // @ts-ignore
      navigation.navigate('Auth');
    }
  };
};

export default function Settings() {
  
  // États pour les options
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationPermission] = useState('always');
  const [trafficDataEnabled, setTrafficDataEnabled] = useState(true);
  const [dataUsage, setDataUsage] = useState('balanced');
  const [darkMode, setDarkMode] = useState(true);
  
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const getLocationText = () => {
    return locationPermission === 'always' 
      ? 'Toujours autoriser' 
      : locationPermission === 'inuse' 
      ? 'Pendant l\'utilisation de l\'application' 
      : 'Jamais';
  };
  
  const getDataUsageText = () => {
    return dataUsage === 'low' 
      ? 'Économisée' 
      : dataUsage === 'balanced' 
      ? 'Équilibrée' 
      : 'Maximum';
  };
  
  const handleDataUsagePress = () => {
    Alert.alert(
      "Utilisation des données",
      "Choisissez le niveau d'utilisation des données",
      [
        { text: "Économisée", onPress: () => setDataUsage('low') },
        { text: "Équilibrée", onPress: () => setDataUsage('balanced') },
        { text: "Maximum", onPress: () => setDataUsage('high') }
      ]
    );
  };
  
  const handleLocationPress = () => {
    Alert.alert(
      "Permissions",
      "Pour modifier l'autorisation de localisation, veuillez accéder aux paramètres de votre appareil."
    );
  };
  
  const handleTermsPress = () => {
    Alert.alert(
      "Conditions d'utilisation",
      "Redirection vers les conditions d'utilisation"
    );
  };
  
  const handlePrivacyPress = () => {
    Alert.alert(
      "Politique de confidentialité",
      "Redirection vers la politique de confidentialité"
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section: Apparence */}
        <SettingSection title="Apparence" titleColor={appColors.text}>
          <SettingToggle
            title="Thème sombre"
            iconName="theme-light-dark"
            value={darkMode}
            onValueChange={setDarkMode}
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
          />
        </SettingSection>
        
        {/* Section: Navigation */}
        <SettingSection title="Navigation" titleColor={appColors.text}>
          <SettingToggle
            title="Données trafic temps réel"
            iconName="traffic-light"
            value={trafficDataEnabled}
            onValueChange={setTrafficDataEnabled}
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
          />
          
          <SettingNavItem
            title="Autorisation de localisation"
            iconName="map-marker"
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
            description={getLocationText()}
            onPress={handleLocationPress}
          />
          
          <SettingNavItem
            title="Utilisation des données"
            iconName="cellphone-arrow-down"
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
            description={getDataUsageText()}
            onPress={handleDataUsagePress}
          />
        </SettingSection>
        
        {/* Section: Notifications */}
        <SettingSection title="Notifications" titleColor={appColors.text}>
          <SettingToggle
            title="Notifications"
            iconName="bell"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
          />
        </SettingSection>
        
        {/* Section: À propos */}
        <SettingSection title="À propos" titleColor={appColors.text}>
          <SettingNavItem
            title="Version"
            iconName="information"
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
            description={appVersion}
            onPress={() => {}}
            showChevron={false}
          />
          
          <SettingNavItem
            title="Conditions d'utilisation"
            iconName="file-document"
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
            description=""
            onPress={handleTermsPress}
          />
          
          <SettingNavItem
            title="Politique de confidentialité"
            iconName="shield-account"
            backgroundColor={appColors.card}
            primaryColor={appColors.primary}
            textColor={appColors.text}
            description=""
            onPress={handlePrivacyPress}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});