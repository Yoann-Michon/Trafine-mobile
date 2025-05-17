import { StyleSheet, View, ActivityIndicator } from 'react-native';

interface MapLoaderProps {
    isLoading: boolean;
}

const MapLoader = ({ isLoading }: MapLoaderProps) => {
    if (!isLoading) return null;
    
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a90e2" />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
});

export default MapLoader;