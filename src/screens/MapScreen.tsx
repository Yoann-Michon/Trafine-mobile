import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import TomTomMap from '../components/tomtom/TomtomMap';
import { RootStackParamList } from '../App';
import SearchPanel from '../components/map/SearchPanel';
import { useState } from 'react';
import { Coordinates } from '../utils/types';

type TomTomMapScreenRouteProp = RouteProp<RootStackParamList, 'Carte'>;

export default function TomTomMapScreen() {
  const route = useRoute<TomTomMapScreenRouteProp>();
  const [routeType, setRouteType] = useState<'fastest' | 'shortest' | 'eco'>('fastest');
  const [transportMode, setTransportMode] = useState<'car' | 'bike' | 'pedestrian'>('car');
  const [isNavigating, setIsNavigating] = useState(false);
  
  const defaultLocation = {
    latitude: 48.8566, 
    longitude: 2.3522,
  };

  const currentLocation = route.params?.currentLocation ?? defaultLocation;
  const destination = route.params?.destination;
  const incidents = route.params?.incidents ?? [];
  const onMapReady = route.params?.onMapReady;

  const handleSearch = (start: string, end: string) => {
    // TODO: Implémenter la recherche d'adresses et la conversion en coordonnées
    console.log('Recherche:', start, end);
  };

  const handleRouteTypeChange = (type: 'fastest' | 'shortest' | 'eco') => {
    setRouteType(type);
    // TODO: Mettre à jour l'itinéraire sur la carte
  };

  const handleTransportModeChange = (mode: 'car' | 'bike' | 'pedestrian') => {
    setTransportMode(mode);
    // TODO: Mettre à jour l'itinéraire sur la carte
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    // TODO: Démarrer la navigation en temps réel
  };

  return (
    <View style={styles.container}>
      <TomTomMap
        currentLocation={currentLocation}
        destination={destination}
        incidents={incidents}
        onMapReady={onMapReady}
        routeType={routeType}
        transportMode={transportMode}
        isNavigating={isNavigating}
      />
      <SearchPanel
        onSearch={handleSearch}
        onRouteTypeChange={handleRouteTypeChange}
        onTransportModeChange={handleTransportModeChange}
        onStartNavigation={handleStartNavigation}
        currentLocation={currentLocation}
        destination={destination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});