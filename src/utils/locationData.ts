import type { LocationData } from '../types/location';

// Import location data - Vite will bundle this
import locationDataJson from '../assets/data.json';

const locationDataList = locationDataJson as LocationData[];

const DEFAULT_LOCATION: LocationData = {
  location: 'Default',
  imagePath: 'https://images.unsplash.com/photo-1767028531579-545818fabbd5?w=1080',
  finalImagePath: 'https://images.unsplash.com/photo-1708720500540-611d360140e9?w=1080',
  initialTreeCount: 50,
  finalTreeCount: 120,
  solarPanelCount: 150,
  vehicles: [
    { type: 'Electric', count: 20 },
    { type: 'Hybrid', count: 15 },
    { type: 'Conventional', count: 80 },
  ],
  percentageEnergyEfficiency: 35,
};

/**
 * Find location data by name. Uses case-insensitive matching.
 * Supports partial matches (e.g. "Connaught Place" matches "Connaught Place, Delhi").
 * Falls back to default if not found.
 */
export function getLocationData(locationName: string): LocationData {
  const normalized = locationName.trim();
  if (!normalized) return DEFAULT_LOCATION;

  const searchLower = normalized.toLowerCase();

  // Exact match first
  const exact = locationDataList.find(
    (loc) => loc.location.toLowerCase() === searchLower
  );
  if (exact) return exact;

  // Partial match - location name contains search or vice versa
  const partial = locationDataList.find(
    (loc) =>
      loc.location.toLowerCase().includes(searchLower) ||
      searchLower.includes(loc.location.toLowerCase())
  );
  if (partial) return partial;

  return DEFAULT_LOCATION;
}

/**
 * Get location suggestions for autocomplete. Matches locations that start with
 * or contain the search query (case-insensitive). Prioritizes "starts with" matches.
 */
export function getLocationSuggestions(query: string): string[] {
  const search = query.trim().toLowerCase();
  if (!search) return [];

  const startsWith = locationDataList.filter((loc) =>
    loc.location.toLowerCase().startsWith(search)
  );
  const contains = locationDataList.filter(
    (loc) =>
      loc.location.toLowerCase().includes(search) &&
      !loc.location.toLowerCase().startsWith(search)
  );

  return [...startsWith.map((l) => l.location), ...contains.map((l) => l.location)];
}

/** All location names that have images in the project */
export const ALL_LOCATION_NAMES = locationDataList.map((l) => l.location);
