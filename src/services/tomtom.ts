import { logger } from '../utils/logger';

const TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY || 'B1wMFo0iy5fLqkdk62FceZaj434OKd5G';
const TOMTOM_BASE_URL = 'https://api.tomtom.com/search/2';

if (!TOMTOM_API_KEY) {
  logger.error('API', 'Clé API TomTom manquante. Veuillez configurer EXPO_PUBLIC_TOMTOM_API_KEY dans votre fichier .env');
}

export type TomTomSearchResult = {
  id: string;
  address: {
    freeformAddress: string;
    country: string;
    countryCode: string;
    municipality: string;
  };
  position: {
    lat: number;
    lon: number;
  };
};

export class TomTomError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'TomTomError';
  }
}

export const searchLocation = async (query: string): Promise<TomTomSearchResult[]> => {
  if (!TOMTOM_API_KEY) {
    throw new TomTomError('Clé API TomTom non configurée');
  }

  try {
    logger.info('API', 'Recherche de lieu', { query });
    
    const response = await fetch(
      `${TOMTOM_BASE_URL}/autocomplete/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=5`
    );
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('API', 'Erreur de recherche TomTom', { 
        status: response.status,
        statusText: response.statusText,
        error 
      });
      throw new TomTomError(
        `Erreur lors de la recherche (${response.status})`,
        error.errorCode
      );
    }

    const data = await response.json();
    const results = data.results.map((result: any) => ({
      id: result.id,
      address: {
        freeformAddress: result.address.freeformAddress,
        country: result.address.country,
        countryCode: result.address.countryCode,
        municipality: result.address.municipality,
      },
      position: {
        lat: result.position.lat,
        lon: result.position.lon,
      },
    }));

    logger.success('API', 'Résultats de recherche trouvés', { count: results.length });
    return results;
  } catch (error) {
    if (error instanceof TomTomError) {
      throw error;
    }
    logger.error('API', 'Erreur inattendue lors de la recherche', error);
    throw new TomTomError('Une erreur inattendue est survenue');
  }
}; 