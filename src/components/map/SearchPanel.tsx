import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, PanResponder, FlatList, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Coordinates } from '../../utils/types';
import { searchLocation, TomTomSearchResult } from '../../services/tomtom';
import { logger } from '../../utils/logger';

interface SearchPanelProps {
  onSearch: (start: string, end: string) => void;
  onRouteTypeChange: (type: 'fastest' | 'shortest' | 'eco') => void;
  onTransportModeChange: (mode: 'car' | 'bike' | 'pedestrian') => void;
  onStartNavigation: () => void;
  currentLocation: Coordinates;
  destination?: Coordinates;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  onSearch,
  onRouteTypeChange,
  onTransportModeChange,
  onStartNavigation,
  currentLocation,
  destination,
}) => {
  const [startLocation, setStartLocation] = useState('Ma position');
  const [endLocation, setEndLocation] = useState('');
  const [selectedRouteType, setSelectedRouteType] = useState<'fastest' | 'shortest' | 'eco'>('fastest');
  const [selectedTransportMode, setSelectedTransportMode] = useState<'car' | 'bike' | 'pedestrian'>('car');
  const [startSuggestions, setStartSuggestions] = useState<TomTomSearchResult[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<TomTomSearchResult[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [panelPosition, setPanelPosition] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const panelHeight = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          panelHeight.setValue(Math.max(0, 1 - gesture.dy / 300));
        } else {
          panelHeight.setValue(Math.min(1, 1 - gesture.dy / 300));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 50) {
          Animated.spring(panelHeight, {
            toValue: 0,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
          }).start(() => setPanelPosition(0));
        } else if (gesture.dy < -50) {
          Animated.spring(panelHeight, {
            toValue: 1,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
          }).start(() => setPanelPosition(1));
        } else {
          Animated.spring(panelHeight, {
            toValue: panelPosition > 0.5 ? 1 : 0,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
          }).start(() => setPanelPosition(panelPosition > 0.5 ? 1 : 0));
        }
      },
    })
  ).current;

  const handleSearch = useCallback(async (text: string, isStart: boolean) => {
    if (!text || text === 'Ma position') return;

    try {
      setIsSearching(true);
      logger.info('SEARCH', 'Recherche de lieu', { text, isStart });
      
      const results = await searchLocation(text);
      
      if (isStart) {
        setStartSuggestions(results);
        setShowStartSuggestions(true);
      } else {
        setEndSuggestions(results);
        setShowEndSuggestions(true);
      }
      
      logger.success('SEARCH', 'Résultats trouvés', { count: results.length });
    } catch (error) {
      logger.error('SEARCH', 'Erreur de recherche', error);
      Alert.alert(
        'Erreur de recherche',
        'Impossible de trouver des résultats. Veuillez réessayer.'
      );
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSuggestionSelect = (suggestion: TomTomSearchResult, isStart: boolean) => {
    const address = suggestion.address.freeformAddress;
    if (isStart) {
      setStartLocation(address);
      setShowStartSuggestions(false);
    } else {
      setEndLocation(address);
      setShowEndSuggestions(false);
    }
    onSearch(isStart ? address : startLocation, isStart ? endLocation : address);
    logger.info('SEARCH', 'Lieu sélectionné', { address, isStart });
  };

  const handleRouteTypeChange = (type: 'fastest' | 'shortest' | 'eco') => {
    setSelectedRouteType(type);
    onRouteTypeChange(type);
  };

  const handleTransportModeChange = (mode: 'car' | 'bike' | 'pedestrian') => {
    setSelectedTransportMode(mode);
    onTransportModeChange(mode);
  };

  const handleStartNavigation = () => {
    if (!startLocation || !endLocation) {
      Alert.alert(
        'Information manquante',
        'Veuillez sélectionner un point de départ et une destination.'
      );
      return;
    }
    logger.info('SEARCH', 'Démarrage de la navigation', { startLocation, endLocation });
    onStartNavigation();
  };

  const renderSuggestionItem = ({ item, isStart }: { item: TomTomSearchResult; isStart: boolean }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionSelect(item, isStart)}
    >
      <MaterialCommunityIcons name="map-marker" size={20} color="#0070f3" />
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionText}>{item.address.freeformAddress}</Text>
        <Text style={styles.suggestionSubtext}>
          {item.address.municipality}, {item.address.country}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: panelHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0]
          })}]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handle} />
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#0070f3" />
          <TextInput
            style={styles.input}
            placeholder="Point de départ"
            value={startLocation}
            onChangeText={(text) => {
              setStartLocation(text);
              handleSearch(text, true);
            }}
            onFocus={() => setShowStartSuggestions(true)}
            placeholderTextColor="#666"
            editable={!isSearching}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#0070f3" style={styles.loadingIndicator} />
          )}
        </View>
        {showStartSuggestions && startSuggestions.length > 0 && (
          <FlatList
            data={startSuggestions}
            renderItem={({ item }) => renderSuggestionItem({ item, isStart: true })}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        )}
        
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="flag" size={20} color="#ff5252" />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={endLocation}
            onChangeText={(text) => {
              setEndLocation(text);
              handleSearch(text, false);
            }}
            onFocus={() => setShowEndSuggestions(true)}
            placeholderTextColor="#666"
            editable={!isSearching}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#0070f3" style={styles.loadingIndicator} />
          )}
        </View>
        {showEndSuggestions && endSuggestions.length > 0 && (
          <FlatList
            data={endSuggestions}
            renderItem={({ item }) => renderSuggestionItem({ item, isStart: false })}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <View style={styles.optionsContainer}>
          <View style={styles.routeTypeContainer}>
            <Text style={styles.sectionTitle}>Type de trajet</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, selectedRouteType === 'fastest' && styles.selectedButton]}
                onPress={() => handleRouteTypeChange('fastest')}
                disabled={isSearching}
              >
                <MaterialCommunityIcons name="lightning-bolt" size={20} color={selectedRouteType === 'fastest' ? '#fff' : '#666'} />
                <Text style={[styles.buttonText, selectedRouteType === 'fastest' && styles.selectedButtonText]}>
                  Plus rapide
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, selectedRouteType === 'shortest' && styles.selectedButton]}
                onPress={() => handleRouteTypeChange('shortest')}
                disabled={isSearching}
              >
                <MaterialCommunityIcons name="map-marker-distance" size={20} color={selectedRouteType === 'shortest' ? '#fff' : '#666'} />
                <Text style={[styles.buttonText, selectedRouteType === 'shortest' && styles.selectedButtonText]}>
                  Plus court
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, selectedRouteType === 'eco' && styles.selectedButton]}
                onPress={() => handleRouteTypeChange('eco')}
                disabled={isSearching}
              >
                <MaterialCommunityIcons name="leaf" size={20} color={selectedRouteType === 'eco' ? '#fff' : '#666'} />
                <Text style={[styles.buttonText, selectedRouteType === 'eco' && styles.selectedButtonText]}>
                  Écologique
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.transportModeContainer}>
            <Text style={styles.sectionTitle}>Mode de transport</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, selectedTransportMode === 'car' && styles.selectedButton]}
                onPress={() => handleTransportModeChange('car')}
                disabled={isSearching}
              >
                <MaterialCommunityIcons name="car" size={20} color={selectedTransportMode === 'car' ? '#fff' : '#666'} />
                <Text style={[styles.buttonText, selectedTransportMode === 'car' && styles.selectedButtonText]}>
                  Voiture
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, selectedTransportMode === 'bike' && styles.selectedButton]}
                onPress={() => handleTransportModeChange('bike')}
                disabled={isSearching}
              >
                <MaterialCommunityIcons name="bike" size={20} color={selectedTransportMode === 'bike' ? '#fff' : '#666'} />
                <Text style={[styles.buttonText, selectedTransportMode === 'bike' && styles.selectedButtonText]}>
                  Vélo
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, selectedTransportMode === 'pedestrian' && styles.selectedButton]}
                onPress={() => handleTransportModeChange('pedestrian')}
                disabled={isSearching}
              >
                <MaterialCommunityIcons name="walk" size={20} color={selectedTransportMode === 'pedestrian' ? '#fff' : '#666'} />
                <Text style={[styles.buttonText, selectedTransportMode === 'pedestrian' && styles.selectedButtonText]}>
                  À pied
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.navigateButton, 
          (!startLocation || !endLocation || isSearching) && styles.navigateButtonDisabled
        ]}
        onPress={handleStartNavigation}
        disabled={!startLocation || !endLocation || isSearching}
      >
        <MaterialCommunityIcons name="navigation" size={24} color="#fff" />
        <Text style={styles.navigateButtonText}>
          {isSearching ? 'Recherche en cours...' : 'Démarrer la navigation'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginTop: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  },
  suggestionSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  routeTypeContainer: {
    marginBottom: 16,
  },
  transportModeContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: '#0070f3',
  },
  buttonText: {
    color: '#666',
    marginLeft: 4,
    fontSize: 12,
  },
  selectedButtonText: {
    color: '#fff',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0070f3',
    paddingVertical: 12,
    borderRadius: 8,
  },
  navigateButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SearchPanel; 