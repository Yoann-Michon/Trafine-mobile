import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TripFilterProps {
  activeFilter: 'all' | 'saved' | 'favorites';
  onFilterChange: (filter: 'all' | 'saved' | 'favorites') => void;
  tripCounts: {
    all: number;
    saved: number;
    favorites: number;
  };
}

const TripFilter= ({ 
  activeFilter, 
  onFilterChange,
  tripCounts
}:TripFilterProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'all' && styles.activeFilterButton
        ]}
        onPress={() => onFilterChange('all')}
      >
        <MaterialCommunityIcons 
          name="format-list-bulleted" 
          size={18} 
          color={activeFilter === 'all' ? '#fff' : '#999'} 
        />
        <Text style={[
          styles.filterText,
          activeFilter === 'all' && styles.activeFilterText
        ]}>
          Tous ({tripCounts.all})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'saved' && styles.activeFilterButton
        ]}
        onPress={() => onFilterChange('saved')}
      >
        <MaterialCommunityIcons 
          name="content-save" 
          size={18} 
          color={activeFilter === 'saved' ? '#fff' : '#999'} 
        />
        <Text style={[
          styles.filterText,
          activeFilter === 'saved' && styles.activeFilterText
        ]}>
          Enregistrés ({tripCounts.saved})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'favorites' && styles.activeFilterButton
        ]}
        onPress={() => onFilterChange('favorites')}
      >
        <MaterialCommunityIcons 
          name="star" 
          size={18} 
          color={activeFilter === 'favorites' ? '#fff' : '#999'} 
        />
        <Text style={[
          styles.filterText,
          activeFilter === 'favorites' && styles.activeFilterText
        ]}>
          Favoris ({tripCounts.favorites})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activeFilterButton: {
    backgroundColor: '#0070f3',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#999',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default TripFilter;