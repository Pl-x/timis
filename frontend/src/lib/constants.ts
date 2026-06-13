export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || `${API_URL}/graphql`;
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

export const TIMIS_SCORE_BANDS = [
  { min: 750, max: 900, label: 'Excellent', color: '#10B981' },
  { min: 650, max: 749, label: 'Good', color: '#3B82F6' },
  { min: 500, max: 649, label: 'Fair', color: '#F59E0B' },
  { min: 350, max: 499, label: 'Poor', color: '#F97316' },
  { min: 0, max: 349, label: 'Very Poor', color: '#EF4444' },
] as const;

export const UNIT_TYPES = [
  'bedsitter',
  'studio',
  '1-bedroom',
  '2-bedroom',
  '3-bedroom',
  '4-bedroom',
  'penthouse',
  'commercial',
  'shop',
  'office',
] as const;

export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans-Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
] as const;
