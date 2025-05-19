import { Coordinates } from './types';

export function getRouteScript(
    origin: Coordinates,
    destination: Coordinates,
    apiKey: string,
    routeType: 'fastest' | 'shortest' | 'eco' = 'fastest',
    transportMode: 'car' | 'bike' | 'pedestrian' = 'car'
): string {
    const routeOptions = {
        key: apiKey,
        locations: [
            [origin.longitude, origin.latitude],
            [destination.longitude, destination.latitude]
        ],
        computeBestOrder: false,
        routeType: routeType,
        travelMode: transportMode
    };

    return `
    const routeOptions = ${JSON.stringify(routeOptions)};
    
    tt.services.calculateRoute(routeOptions)
      .then(function(routeData) {
        const geojson = routeData.toGeoJson();
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': geojson
          },
          'paint': {
            'line-color': '#4a90e2',
            'line-width': 6
          }
        });
        
        // Ajuster la carte pour voir l'itinéraire complet
        const bounds = new tt.LngLatBounds();
        geojson.features[0].geometry.coordinates.forEach(function(point) {
          bounds.extend(tt.LngLat.convert(point));
        });
        map.fitBounds(bounds, { padding: 50 });
      });
    
    // Ajouter un marqueur à la destination
    new tt.Marker().setLngLat([${destination.longitude}, ${destination.latitude}])
      .addTo(map);
  `;
}