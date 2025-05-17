// components/trips/EmptyTripsView.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface EmptyTripsViewProps {
  filter: 'all' | 'saved' | 'favorites';
}

const EmptyTripsView: React.FC<EmptyTripsViewProps> = ({ filter }) => {
  let message = '';
  
  switch (filter) {
    case 'saved':
      message = "Vous n'avez pas encore de trajets enregistrés";
      break;
    case 'favorites':
      message = "Vous n'avez pas encore de trajets favoris";
      break;
    default:
      message = "Vous n'avez pas encore effectué de trajets";
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subMessage}>
        Créez un nouvel itinéraire pour commencer à naviguer
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default EmptyTripsView;