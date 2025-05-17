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
//import { useAuth } from '../hooks/useAuth';

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export default function AuthPanel() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  //const { login, register: registerUser, isLoading } = useAuth();
  let isLoading=false;
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
     // await login(loginForm);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      //await registerUser(registerForm);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  console.log('Rendering AuthPanel, activeTab:', activeTab);

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
              Login
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
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'login' && (
          <View style={styles.tabContent}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Username</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your username"
                placeholderTextColor="#9ca3af"
                value={loginForm.username}
                onChangeText={(text) => updateLoginForm('username', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Password</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your password"
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
                  <Text style={styles.buttonText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Login</Text>
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
        )}

        {activeTab === 'register' && (
          <View style={styles.tabContent}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Username</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Choose a username"
                placeholderTextColor="#9ca3af"
                value={registerForm.username}
                onChangeText={(text) => updateRegisterForm('username', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={registerForm.email}
                onChangeText={(text) => updateRegisterForm('email', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Password</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Create a password"
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
                  <Text style={styles.buttonText}>Registering...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Register</Text>
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
    backgroundColor: '#f1f5f9', 
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
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  tabTriggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b', 
  },
  activeTabTriggerText: {
    color: '#0f172a', 
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
    backgroundColor: '#f8fafc', 
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0', 
    borderRadius: 6,
    fontSize: 16,
    color: '#0f172a', 
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
});