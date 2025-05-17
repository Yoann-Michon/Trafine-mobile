import { Incident } from './types';

export function getIncidentMarkersScript(incidents: Incident[]): string {
    const markersScript = incidents.map((incident, index) => `
        new tt.Marker({
            element: createCustomMarker('${incident.type}')
        }).setLngLat([${incident.longitude}, ${incident.latitude}])
            .setPopup(new tt.Popup({ offset: 30 }).setHTML('<p>${incident.description}</p>'))
            .addTo(map);
    `).join('');

    const createMarkerFunction = `
        function createCustomMarker(type) {
            const element = document.createElement('div');
            element.className = 'custom-marker';
            element.style.width = '25px';
            element.style.height = '25px';
            element.style.borderRadius = '50%';
            
            // Différentes couleurs selon le type d'incident
            switch(type) {
                case 'accident':
                    element.style.backgroundColor = '#ff0000';
                    break;
                case 'traffic':
                    element.style.backgroundColor = '#ff9900';
                    break;
                case 'police':
                    element.style.backgroundColor = '#0066ff';
                    break;
                case 'road_closed':
                    element.style.backgroundColor = '#990000';
                    break;
                default:
                    element.style.backgroundColor = '#666666';
            }
            
            return element;
        }
    `;

    return `${createMarkerFunction} ${markersScript}`;
}