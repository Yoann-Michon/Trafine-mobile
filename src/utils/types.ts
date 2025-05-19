export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Incident {
    id?: string;
    type: string;
    latitude: number;
    longitude: number;
    description: string;
}

export interface TomTomMapProps {
    currentLocation: Coordinates;
    destination?: Coordinates;
    incidents?: Incident[];
    onMapReady?: () => void;
    routeType?: 'fastest' | 'shortest' | 'eco';
    transportMode?: 'car' | 'bike' | 'pedestrian';
    isNavigating?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  date: Date;
  duration: number; 
  distance: number; 
  saved: boolean;
  favorite: boolean;
}