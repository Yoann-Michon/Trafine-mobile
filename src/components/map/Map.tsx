import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Coordinates } from '../../utils/types';
import { logger } from '../../utils/logger';

interface MapProps {
  onRegionChange?: (region: Region) => void;
  markers?: Array<{
    coordinate: Coordinates;
    title?: string;
    description?: string;
  }>;
  initialRegion?: Region;
}

const Map: React.FC<MapProps> = ({
  onRegionChange,
  markers = [],
  initialRegion,
}) => {
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [region, setRegion] = useState<Region | undefined>(initialRegion);
  const [zoomLevel, setZoomLevel] = useState(15);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          logger.warning('MAP', 'Permission de localisation refusée');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(newLocation);
        
        if (!initialRegion) {
          setRegion({
            ...newLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
        
        logger.success('MAP', 'Position actuelle récupérée', newLocation);
      } catch (error) {
        logger.error('MAP', 'Erreur lors de la récupération de la position', error);
      }
    })();
  }, []);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    onRegionChange?.(newRegion);
  };

  const handleZoomIn = () => {
    if (mapRef.current && region) {
      const newZoom = Math.min(zoomLevel + 1, 20);
      setZoomLevel(newZoom);
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      });
      logger.info('MAP', 'Zoom avant', { newZoom });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && region) {
      const newZoom = Math.max(zoomLevel - 1, 1);
      setZoomLevel(newZoom);
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      });
      logger.info('MAP', 'Zoom arrière', { newZoom });
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(newLocation);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
      
      logger.success('MAP', 'Retour à la position actuelle', newLocation);
    } catch (error) {
      logger.error('MAP', 'Erreur lors du retour à la position actuelle', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleCurrentLocation}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#0070f3" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleZoomIn}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#0070f3" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleZoomOut}
        >
          <MaterialCommunityIcons name="minus" size={24} color="#0070f3" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
});

export default Map; 