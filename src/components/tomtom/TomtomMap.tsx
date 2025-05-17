// components/map/TomTomMap.tsx
import React, { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import { TomTomMapProps } from '../../utils/types';
import MapLoader from './MapLoader';
import { generateMapHtml } from './MapTemplate';

const TomTomMap = ({
    currentLocation,
    destination,
    incidents = [],
    onMapReady,
}: TomTomMapProps) => {
    const webViewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleMessage = (event: any) => {
        const { data } = event.nativeEvent;
        if (data === 'mapReady') {
            setIsLoading(false);
            if (onMapReady) onMapReady();
        }
    };

    // Générer le HTML pour la carte
    const htmlContent = generateMapHtml(currentLocation, destination, incidents);

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={styles.webview}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                geolocationEnabled={true}
            />
            <MapLoader isLoading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    webview: {
        flex: 1,
    },
});

export default TomTomMap;