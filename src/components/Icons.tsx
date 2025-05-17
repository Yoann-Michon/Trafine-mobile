import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

// Définition du type pour les noms d'icônes
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Interface pour les props de notre composant d'icône
interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Composant Icon - Wrapper unifié pour toutes les icônes du projet
 * 
 * Utilise MaterialCommunityIcons qui a la collection la plus complète
 * d'icônes et couvre la plupart des besoins.
 */
export function Icon({ 
  name, 
  size = 24, 
  color = '#000', 
  style 
}: IconProps) {
  return (
    <MaterialCommunityIcons 
      name={name} 
      size={size} 
      color={color} 
      style={style} 
    />
  );
}

export const ICONS = {
  // Navigation et App
  NAVIGATION: 'navigation' as IconName,
  MENU: 'menu' as IconName,
  HOME: 'home' as IconName,
  SETTINGS: 'cog' as IconName,
  HISTORY: 'history' as IconName,
  STATS: 'chart-bar' as IconName,
  ADMIN: 'shield-account' as IconName,
  
  // Actions
  SEARCH: 'magnify' as IconName,
  ADD: 'plus' as IconName,
  EDIT: 'pencil' as IconName,
  DELETE: 'delete' as IconName,
  SHARE: 'share-variant' as IconName,
  
  // Map et Navigation
  MAP: 'map' as IconName,
  LOCATION: 'map-marker' as IconName,
  ROUTE: 'routes' as IconName,
  DIRECTIONS: 'directions' as IconName,
  
  // Incidents
  WARNING: 'alert' as IconName,
  ACCIDENT: 'car-crash' as IconName,
  TRAFFIC: 'traffic-light' as IconName,
  POLICE: 'police-badge' as IconName,
  ROAD_CLOSED: 'road-closed' as IconName,
  CONSTRUCTION: 'hammer' as IconName,
  OBSTACLE: 'alert-octagon' as IconName,
  
  // Authentification
  USER: 'account' as IconName,
  LOGIN: 'login' as IconName,
  LOGOUT: 'logout' as IconName,
  PASSWORD: 'lock' as IconName,
  EMAIL: 'email' as IconName,
  
  // Général
  SUCCESS: 'check-circle' as IconName,
  ERROR: 'alert-circle' as IconName,
  INFO: 'information' as IconName,
  BACK: 'arrow-left' as IconName,
  CLOSE: 'close' as IconName,
  
  // Social
  GOOGLE: 'google' as IconName,
  FACEBOOK: 'facebook' as IconName,
  
  // Divers
  CLOCK: 'clock-outline' as IconName,
  CALENDAR: 'calendar' as IconName,
  TRENDING_UP: 'trending-up' as IconName,
  TRENDING_DOWN: 'trending-down' as IconName,
} as const;



export interface StatCardProps {
    title: string;
    iconName: IconName;
    value: number | null;
    description: string;
    isLoading: boolean;
}