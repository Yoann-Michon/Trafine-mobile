import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    logger.info('AUTH', 'Initialisation du hook');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      logger.info('AUTH', 'Vérification de l\'authentification');
      const userData = await AsyncStorage.getItem('user');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        logger.success('AUTH', 'Utilisateur trouvé', parsedUser);
        setState(prev => ({ ...prev, user: parsedUser, isLoading: false }));
      } else {
        logger.info('AUTH', 'Aucun utilisateur trouvé');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      logger.error('AUTH', 'Erreur de vérification', error);
      setState(prev => ({ ...prev, error: 'Erreur lors de la vérification de l\'authentification', isLoading: false }));
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      logger.info('AUTH', 'Tentative de connexion', { username: credentials.username });
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Remplacer par un appel API réel
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour le moment, on simule une connexion réussie
      const user = {
        id: '1',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
      };

      logger.info('AUTH', 'Sauvegarde des données utilisateur');
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setState(prev => ({ ...prev, user, isLoading: false }));
      logger.success('AUTH', 'Connexion réussie', { user });
      
      return user;
    } catch (error) {
      logger.error('AUTH', 'Erreur de connexion', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de la connexion', 
        isLoading: false 
      }));
      throw error;
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    try {
      logger.info('AUTH', 'Tentative d\'inscription', { 
        username: data.username,
        email: data.email 
      });
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Remplacer par un appel API réel
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour le moment, on simule une inscription réussie
      const user = {
        id: '1',
        username: data.username,
        email: data.email,
      };

      logger.info('AUTH', 'Sauvegarde des données utilisateur');
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setState(prev => ({ ...prev, user, isLoading: false }));
      logger.success('AUTH', 'Inscription réussie', { user });
      
      return user;
    } catch (error) {
      logger.error('AUTH', 'Erreur d\'inscription', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de l\'inscription', 
        isLoading: false 
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      logger.info('AUTH', 'Tentative de déconnexion');
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await AsyncStorage.removeItem('user');
      logger.info('AUTH', 'Données utilisateur supprimées');
      
      setState(prev => ({ ...prev, user: null, isLoading: false }));
      logger.success('AUTH', 'Déconnexion réussie');
    } catch (error) {
      logger.error('AUTH', 'Erreur de déconnexion', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de la déconnexion', 
        isLoading: false 
      }));
      throw error;
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
  };
}; 