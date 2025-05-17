// screens/TripsScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EmptyTripsView from '../components/Trips/EmptyTripsView';
import TripFilter from '../components/Trips/TripFilter';
import TripItem from '../components/Trips/TripItem';
import { Trip } from '../utils/types';

const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    name: 'Trajet domicile-travail',
    startLocation: 'Rue de la Liberté, Paris',
    endLocation: 'Quartier d\'affaires, La Défense',
    date: new Date('2025-05-12T08:30:00'),
    duration: 35, // minutes
    distance: 12.5, // km
    saved: true,
    favorite: true,
  },
  {
    id: '2',
    name: 'Visite chez les parents',
    startLocation: 'Rue de la Liberté, Paris',
    endLocation: 'Avenue Victor Hugo, Lyon',
    date: new Date('2025-05-10T14:00:00'),
    duration: 120,
    distance: 392,
    saved: true,
    favorite: false,
  },
  {
    id: '3',
    name: 'Rendez-vous client',
    startLocation: 'Quartier d\'affaires, La Défense',
    endLocation: 'Place de la Bourse, Paris',
    date: new Date('2025-05-09T10:15:00'),
    duration: 25,
    distance: 8.7,
    saved: false,
    favorite: false,
  },
  {
    id: '4',
    name: 'Shopping',
    startLocation: 'Rue de la Liberté, Paris',
    endLocation: 'Centre commercial Westfield, Paris',
    date: new Date('2025-05-08T15:45:00'),
    duration: 18,
    distance: 5.3,
    saved: false,
    favorite: false,
  },
  {
    id: '5',
    name: 'Restaurant avec amis',
    startLocation: 'Rue de la Liberté, Paris',
    endLocation: 'Quartier Latin, Paris',
    date: new Date('2025-05-07T19:30:00'),
    duration: 22,
    distance: 6.2,
    saved: true,
    favorite: true,
  },
];

// Types de filtres disponibles
type FilterType = 'all' | 'saved' | 'favorites';

export default function TripsScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<FilterType>('all');
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  
  // Filtrer les trajets en fonction du filtre sélectionné
  const filteredTrips = trips.filter(trip => {
    if (filter === 'saved') return trip.saved;
    if (filter === 'favorites') return trip.favorite;
    return true; // 'all'
  });
  
  // Fonction pour naviguer vers la carte avec un itinéraire
  const handleTripPress = (trip: Trip) => {
    // @ts-ignore
    navigation.navigate('Carte', {
      routeId: trip.id,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation
    });
  };
  
  // Fonction pour marquer un trajet comme favori
  const toggleFavorite = (id: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === id ? { ...trip, favorite: !trip.favorite } : trip
      )
    );
  };
  
  // Fonction pour supprimer un trajet
  const deleteTrip = (id: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes trajets</Text>
        <TouchableOpacity 
          style={styles.newTripButton}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Carte');
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.newTripText}>Nouveau</Text>
        </TouchableOpacity>
      </View>
      
      <TripFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        tripCounts={{
          all: trips.length,
          saved: trips.filter(t => t.saved).length,
          favorites: trips.filter(t => t.favorite).length
        }}
      />
      
      {filteredTrips.length === 0 ? (
        <EmptyTripsView filter={filter} />
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TripItem
              trip={item}
              onPress={() => handleTripPress(item)}
              onFavoriteToggle={() => toggleFavorite(item.id)}
              onDelete={() => deleteTrip(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  newTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0070f3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  newTripText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
});