import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import TomTomMap from '../components/tomtom/TomtomMap';
import { RootStackParamList } from '../App';

type TomTomMapScreenRouteProp = RouteProp<RootStackParamList, 'Carte'>;

export default function TomTomMapScreen() {
  const route = useRoute<TomTomMapScreenRouteProp>();
  
  const defaultLocation = {
    latitude: 48.8566, 
    longitude: 2.3522,
  };

  const currentLocation = route.params?.currentLocation ?? defaultLocation;
  const destination = route.params?.destination;
  const incidents = route.params?.incidents ?? [];
  const onMapReady = route.params?.onMapReady;

  return (
    <View style={styles.container}>
      <TomTomMap
        currentLocation={currentLocation}
        destination={destination}
        incidents={incidents}
        onMapReady={onMapReady}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});