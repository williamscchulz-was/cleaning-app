import {
  Bath, Bed, ChefHat, Droplets, Home as HomeIcon, LayoutGrid, Sofa,
} from 'lucide-react';

export const AREAS = [
  'Sala',
  'Cozinha',
  'Lavação',
  'Quarto principal',
  'Quarto Louise',
  'Banheiros',
  'Lavabo',
  'Geral',
];

// Legacy area names that should be displayed under the new merged area.
// Tasks created before the area refactor still carry these — we normalize
// at read time in useTasks so the rest of the app sees the new names.
export const LEGACY_AREA_MAP = {
  'Banheiro principal': 'Banheiros',
  'Banheiro Louise':    'Banheiros',
};

export const FREQUENCIES = {
  semanal:    { label: 'Semanal',    weeks: 1  },
  bissemanal: { label: 'Bissemanal', weeks: 2  },
  mensal:     { label: 'Mensal',     weeks: 4  },
  bimensal:   { label: 'Bimensal',   weeks: 8  },
  trimestral: { label: 'Trimestral', weeks: 12 },
  semestral:  { label: 'Semestral',  weeks: 26 },
};

export const FREQUENCY_KEYS = Object.keys(FREQUENCIES);

export const AREA_ICONS = {
  'Sala': Sofa,
  'Cozinha': ChefHat,
  'Lavação': Droplets,
  'Quarto principal': Bed,
  'Quarto Louise': Bed,
  'Banheiros': Bath,
  'Lavabo': Bath,
  'Geral': LayoutGrid,
};

export const ICON_FALLBACK = HomeIcon;

export const PEOPLE = {
  simone:  { name: 'Simone',  role: 'Diarista',        bg: '#820AD1', textColor: '#FFFFFF', initial: 'S', article: 'a' },
  flavia:  { name: 'Flávia',  role: 'Mamãe da Louise', bg: '#F5EFFE', textColor: '#820AD1', initial: 'F', article: 'a' },
  william: { name: 'William', role: 'Papai da Louise', bg: '#1C1C1E', textColor: '#FFFFFF', initial: 'W', article: 'o' },
};

export const ROLE_KEYS = Object.keys(PEOPLE);
