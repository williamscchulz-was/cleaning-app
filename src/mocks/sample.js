// Throwaway sample data for design mockups. Not wired to Firestore.
export const SAMPLE_TASKS = [
  { id: '1', name: 'Aspirar a sala',                 area: 'Sala',               freq: 'Semanal',    notes: '',                                       doneToday: true  },
  { id: '2', name: 'Tirar pó dos móveis',            area: 'Sala',               freq: 'Semanal',    notes: '',                                       doneToday: true  },
  { id: '3', name: 'Lavar capas de almofada',        area: 'Sala',               freq: 'Bimensal',   notes: '',                                       doneToday: false },
  { id: '4', name: 'Lavar o piso',                   area: 'Cozinha',            freq: 'Semanal',    notes: '',                                       doneToday: false },
  { id: '5', name: 'Limpar a pia e bancada',         area: 'Cozinha',            freq: 'Semanal',    notes: '',                                       doneToday: false },
  { id: '6', name: 'Limpar a geladeira por dentro',  area: 'Cozinha',            freq: 'Mensal',     notes: '',                                       doneToday: false },
  { id: '7', name: 'Trocar a roupa de cama',         area: 'Quarto principal',   freq: 'Semanal',    notes: '',                                       doneToday: false },
  { id: '8', name: 'Aspirar e tirar pó',             area: 'Quarto Louise',      freq: 'Semanal',    notes: 'Aspirar com cuidado perto do berço',     doneToday: false },
  { id: '9', name: 'Limpar completo',                area: 'Banheiro principal', freq: 'Semanal',    notes: '',                                       doneToday: false },
];

export const SAMPLE_AREAS = [
  'Sala',
  'Cozinha',
  'Quarto principal',
  'Quarto Louise',
  'Banheiro principal',
];

export const SAMPLE_TODAY = 'Segunda, 5 de maio';
