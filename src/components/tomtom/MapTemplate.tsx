import { getIncidentMarkersScript } from "../../utils/IncidentMarker";
import { getRouteScript } from "../../utils/Route";
import { Coordinates, Incident } from "../../utils/types";

const TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY || 'B1wMFo0iy5fLqkdk62FceZaj434OKd5G';

export function generateMapHtml(
    currentLocation: Coordinates,
    destination?: Coordinates,
    incidents: Incident[] = [],
    routeType: 'fastest' | 'shortest' | 'eco' = 'fastest',
    transportMode: 'car' | 'bike' | 'pedestrian' = 'car',
    isNavigating: boolean = false
): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" type="text/css" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css"/>
        <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps-web.min.js"></script>
        <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/services/services-web.min.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialiser la carte TomTom
          const map = tt.map({
            key: '${TOMTOM_API_KEY}',
            container: 'map',
            center: [${currentLocation.longitude}, ${currentLocation.latitude}],
            zoom: 13,
            stylesVisibility: {
              trafficFlow: true,
              trafficIncidents: true
            }
          });
          
          // Marquer la position actuelle
          new tt.Marker().setLngLat([${currentLocation.longitude}, ${currentLocation.latitude}])
            .addTo(map);
          
          // Notifier React Native que la carte est prête
          map.on('load', function() {
            window.ReactNativeWebView.postMessage('mapReady');
          });
          
          // Ajouter l'itinéraire si une destination est spécifiée
          ${destination ? getRouteScript(currentLocation, destination, TOMTOM_API_KEY, routeType, transportMode) : ''}
          
          // Ajouter les incidents sur la carte
          ${incidents && incidents.length > 0 ? getIncidentMarkersScript(incidents) : ''}

          // Gérer la navigation en temps réel
          ${isNavigating ? `
            let watchId;
            function startNavigation() {
              watchId = navigator.geolocation.watchPosition(
                function(position) {
                  const newLocation = [position.coords.longitude, position.coords.latitude];
                  map.flyTo({
                    center: newLocation,
                    zoom: 15
                  });
                  
                  // Mettre à jour le marqueur de position
                  if (currentMarker) {
                    currentMarker.setLngLat(newLocation);
                  } else {
                    currentMarker = new tt.Marker().setLngLat(newLocation).addTo(map);
                  }
                },
                function(error) {
                  console.error('Erreur de géolocalisation:', error);
                },
                {
                  enableHighAccuracy: true,
                  maximumAge: 0,
                  timeout: 5000
                }
              );
            }

            let currentMarker;
            startNavigation();
          ` : ''}
        </script>
      </body>
    </html>
  `;
}