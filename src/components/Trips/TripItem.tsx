import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Trip } from '../../utils/types';

function formatDate(date: Date): string {
  // Format: "12 mai à 08:30"
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options).replace(' à ', ' à ');
}

interface TripItemProps {
  trip: Trip;
  onPress: () => void;
  onFavoriteToggle: () => void;
  onDelete: () => void;
}

const TripItem= ({ 
  trip, 
  onPress,
  onFavoriteToggle,
  onDelete
}:TripItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.mainContent}>
        <View style={styles.nameRow}>
          <Text style={styles.tripName}>{trip.name}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={onFavoriteToggle}
          >
            <MaterialCommunityIcons 
              name={trip.favorite ? "star" : "star-outline"} 
              size={20} 
              color={trip.favorite ? "#FFD700" : "#777"} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.date}>{formatDate(trip.date)}</Text>
        
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <View style={styles.startDot} />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {trip.startLocation}
            </Text>
          </View>
          
          <View style={styles.verticalLine} />
          
          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <View style={styles.endDot} />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {trip.endLocation}
            </Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#999" />
            <Text style={styles.statText}>{trip.duration} min</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker-distance" size={14} color="#999" />
            <Text style={styles.statText}>{trip.distance} km</Text>
          </View>
          {trip.saved && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedText}>Enregistré</Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <MaterialCommunityIcons name="delete-outline" size={22} color="#ff5252" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  favoriteButton: {
    padding: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0070f3',
  },
  endDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff5252',
  },
  verticalLine: {
    width: 1,
    height: 15,
    backgroundColor: '#444',
    marginLeft: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 8,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  savedBadge: {
    backgroundColor: '#0070f380',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savedText: {
    fontSize: 12,
    color: '#fff',
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 4,
  },
});

export default TripItem;