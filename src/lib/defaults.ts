/** Seed / fallback values — the figures from the design handoff. */
export const DEFAULT_STATS = {
  admittedCount: 18,
  totalCount: 20,
  graduateAdmissions: 3,
  fundingMinPct: 25,
  fundingMaxPct: 100,
  practiceNoteHy: 'Չորս տարվա փորձ։ Քսան հաճախորդ, յուրաքանչյուրը՝ անհատական խորհրդատվությամբ։ Թիվը միտումնավոր փոքր է։',
  practiceNoteRu: 'Четыре года практики. Двадцать клиентов, каждого консультировали лично. Число намеренно небольшое.',
  practiceNoteEn: 'Four years of practice. Twenty clients, each advised personally. The number is small on purpose.',
  fundingCaveatHy: '[Վերապահում ներկայացման 10-րդ սլայդից։]',
  fundingCaveatRu: '[Оговорка со слайда 10 презентации.]',
  fundingCaveatEn: '[Caveat from deck slide 10, set in italic.]',
};

export const DEFAULT_UNIVERSITIES = [
  { name: 'Harvard', countryHy: 'ԱՄՆ', countryRu: 'США', countryEn: 'United States', sortOrder: 1, visible: true, showOnHome: true },
  { name: 'Columbia', countryHy: 'ԱՄՆ', countryRu: 'США', countryEn: 'United States', sortOrder: 2, visible: true, showOnHome: true },
  { name: 'UCLA', countryHy: 'ԱՄՆ', countryRu: 'США', countryEn: 'United States', sortOrder: 3, visible: true, showOnHome: true },
  { name: 'University of Toronto', countryHy: 'Կանադա', countryRu: 'Канада', countryEn: 'Canada', sortOrder: 4, visible: true, showOnHome: true },
  { name: 'NYU Abu Dhabi', countryHy: 'ԱՄԷ', countryRu: 'ОАЭ', countryEn: 'United Arab Emirates', sortOrder: 5, visible: true, showOnHome: true },
  { name: 'NYU Shanghai', countryHy: 'Չինաստան', countryRu: 'Китай', countryEn: 'China', sortOrder: 6, visible: true, showOnHome: true },
  { name: 'Sorbonne', countryHy: 'Ֆրանսիա', countryRu: 'Франция', countryEn: 'France', sortOrder: 7, visible: true, showOnHome: true },
  { name: 'Rome Business School', countryHy: 'Իտալիա', countryRu: 'Италия', countryEn: 'Italy', sortOrder: 8, visible: true, showOnHome: true },
];
