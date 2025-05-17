// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Type pour les données utilisateur
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joinDate: Date;
}

const mockUser: UserProfile = {
  id: 'u1',
  name: 'Thomas Dupont',
  email: 'thomas.dupont@example.com',
  avatar: null,
  joinDate: new Date('2023-01-15')
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  
  // Ouvrir le modal d'édition
  const handleEditProfile = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(true);
  };
  
  // Sauvegarder les modifications
  const handleSaveProfile = () => {
    // Validation de base
    if (!editName.trim()) {
      Alert.alert('Erreur', 'Le nom ne peut pas être vide');
      return;
    }
    
    if (!editEmail.trim() || !editEmail.includes('@')) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return;
    }
    
    // Mettre à jour les informations de l'utilisateur
    setUser(prev => ({
      ...prev,
      name: editName.trim(),
      email: editEmail.trim()
    }));
    
    // Fermer le modal
    setIsEditing(false);
    
    // Confirmation
    Alert.alert('Succès', 'Vos informations ont été mises à jour');
  };
  
  // Annuler les modifications
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const formatJoinDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long'
    };
    return `Membre depuis ${date.toLocaleDateString('fr-FR', options)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Modal d'édition du profil
  const renderEditModal = () => (
    <Modal
      visible={isEditing}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelEdit}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier le profil</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Votre nom"
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Votre email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.avatarEditSection}>
            <View style={styles.avatarPreview}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarPreviewImage} />
              ) : (
                <View style={styles.avatarPreviewPlaceholder}>
                  <Text style={styles.avatarInitials}>{getInitials(editName || user.name)}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Feather name="camera" size={20} color="#fff" />
              <Text style={styles.changeAvatarText}>Changer l'avatar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {renderEditModal()}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête de profil */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials(user.name)}</Text>
              </View>
            )}
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.joinDate}>{formatJoinDate(user.joinDate)}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
              <Feather name="edit-2" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0070f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
  },
  accountSection: {
    marginBottom: 24,
  },
  legalSection: {
    marginBottom: 24,
  },
  settingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  accountMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemIcon: {
    width: 32,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  // Styles pour le modal d'édition
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  avatarEditSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarPreview: {
    marginBottom: 16,
  },
  avatarPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPreviewPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0070f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changeAvatarText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#333',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#0070f3',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});