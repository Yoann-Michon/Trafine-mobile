import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Icon, ICONS } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../utils/logger';

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

const logAuthPanel = (action: string, data?: any) => {
  console.log(`👤 [AUTH_PANEL] ${action}`, data ? data : '');
};

const logError = (action: string, error: any) => {
  console.error(`❌ [AUTH_PANEL] ${action}`, error);
};

export default function AuthPanel() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { login, register: registerUser, isLoading, error } = useAuth();
  const navigation = useNavigation();

  const [loginForm, setLoginForm] = useState<LoginData>({
    username: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
  });

  const updateLoginForm = (field: keyof LoginData, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const updateRegisterForm = (field: keyof RegisterData, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginSubmit = async () => {
    try {
      logger.info('AUTH_PANEL', 'Tentative de connexion', { username: loginForm.username });
      await login(loginForm);
      logger.success('AUTH_PANEL', 'Connexion réussie, redirection vers Main');
      // @ts-ignore - we'll handle typing for navigation later
      navigation.navigate('Main');
    } catch (error) {
      logger.error('AUTH_PANEL', 'Erreur de connexion', error);
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      logger.info('AUTH_PANEL', 'Tentative d\'inscription', { 
        username: registerForm.username,
        email: registerForm.email 
      });
      await registerUser(registerForm);
      logger.success('AUTH_PANEL', 'Inscription réussie, redirection vers Main');
      // @ts-ignore - we'll handle typing for navigation later
      navigation.navigate('Main');
    } catch (error) {
      logger.error('AUTH_PANEL', 'Erreur d\'inscription', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tabList}>
          <TouchableOpacity
            style={[
              styles.tabTrigger,
              activeTab === 'login' ? styles.activeTabTrigger : null
            ]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[
              styles.tabTriggerText,
              activeTab === 'login' ? styles.activeTabTriggerText : null
            ]}>
              Connexion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabTrigger,
              activeTab === 'register' ? styles.activeTabTrigger : null
            ]}
            onPress={() => setActiveTab('register')}
          >
            <Text style={[
              styles.tabTriggerText,
              activeTab === 'register' ? styles.activeTabTriggerText : null
            ]}>
              Inscription
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {activeTab === 'login' ? (
          <View style={styles.tabContent}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Nom d'utilisateur</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Entrez votre nom d'utilisateur"
                placeholderTextColor="#9ca3af"
                value={loginForm.username}
                onChangeText={(text) => updateLoginForm('username', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Mot de passe</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={loginForm.password}
                onChangeText={(text) => updateLoginForm('password', text)}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLoginSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                  <Text style={styles.buttonText}>Connexion en cours...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <View style={styles.oauthContainer}>
              <TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#4285F4' }]}>
                <View style={styles.buttonContent}>
                  <Icon name={ICONS.GOOGLE} size={16} color="#fff" />
                  <Text style={styles.oauthButtonText}>Google</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#1877F2' }]}>
                <View style={styles.buttonContent}>
                  <Icon name={ICONS.FACEBOOK} size={16} color="#fff" />
                  <Text style={styles.oauthButtonText}>Facebook</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.tabContent}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Nom d'utilisateur</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Choisissez un nom d'utilisateur"
                placeholderTextColor="#9ca3af"
                value={registerForm.username}
                onChangeText={(text) => updateRegisterForm('username', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Entrez votre email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={registerForm.email}
                onChangeText={(text) => updateRegisterForm('email', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Mot de passe</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Créez un mot de passe"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={registerForm.password}
                onChangeText={(text) => updateRegisterForm('password', text)}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegisterSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                  <Text style={styles.buttonText}>Inscription en cours...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  tabList: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 2,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  activeTabTrigger: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  tabTriggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabTriggerText: {
    color: '#fff',
  },
  tabContent: {
    paddingHorizontal: 4,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#0070f3',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoader: {
    marginRight: 8,
  },
  oauthContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  oauthButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});