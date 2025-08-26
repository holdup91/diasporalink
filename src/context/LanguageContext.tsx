import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateCity: (cityName: string) => string;
  translateCountry: (countryName: string) => string;
}

const translations = {
  // Search Form
  searchTitle: {
    en: 'Find the Right Transport Service in Seconds',
    fr: 'Déterminez votre transporteur parfait en quelques secondes',
    ar: 'اعثر على خدمة النقل المناسبة في ثوانٍ'
  },
  from: {
    en: 'From',
    fr: 'De',
    ar: 'من'
  },
  to: {
    en: 'To',
    fr: 'Vers',
    ar: 'إلى'
  },
  search: {
    en: 'Search',
    fr: 'Rechercher',
    ar: 'بحث'
  },
  // Trip Results
  upcomingTrips: {
    en: 'Upcoming Trips',
    fr: 'Voyages à Venir',
    ar: 'الرحلات القادمة'
  },
  departsIn: {
    en: 'Departs in',
    fr: 'Départ dans',
    ar: 'المغادرة خلال'
  },
  days: {
    en: 'days',
    fr: 'jours',
    ar: 'أيام'
  },
  contact: {
    en: 'Contact',
    fr: 'Contacter',
    ar: 'اتصال'
  },
  // Trip Details
  price: {
    en: 'Price',
    fr: 'Prix',
    ar: 'السعر'
  },
  perKg: {
    en: '/kg',
    fr: '/kg',
    ar: '/كغ'
  },
  notes: {
    en: 'Notes',
    fr: 'Notes',
    ar: 'ملاحظات'
  },
  route: {
    en: 'Route',
    fr: 'Itinéraire',
    ar: 'المسار'
  },
  contacts: {
    en: 'Contact Options',
    fr: 'Options de Contact',
    ar: 'خيارات الاتصال'
  },
  // Common
  loading: {
    en: 'Loading...',
    fr: 'Chargement...',
    ar: 'جاري التحميل...'
  },
  noResults: {
    en: 'No trips found',
    fr: 'Aucun voyage trouvé',
    ar: 'لم يتم العثور على رحلات'
  },
  backToSearch: {
    en: 'Back to Search',
    fr: 'Retour à la Recherche',
    ar: 'العودة إلى البحث'
  },
  departureDate: {
    en: 'Departure Date',
    fr: 'Date de Départ',
    ar: 'تاريخ المغادرة'
  },
  'departure Date': {
    en: 'Departure Date',
    fr: 'Date de Départ',
    ar: 'تاريخ المغادرة'
  },
  foundTrips: {
    en: 'Found',
    fr: 'Trouvé',
    ar: 'تم العثور على'
  },
  tripsMatching: {
    en: 'trips matching your criteria',
    fr: 'voyages correspondant à vos critères',
    ar: 'رحلات تطابق معاييرك'
  },
  trip: {
    en: 'trip',
    fr: 'voyage',
    ar: 'رحلة'
  },
  trips: {
    en: 'trips',
    fr: 'voyages',
    ar: 'رحلات'
  },
  tryAdjusting: {
    en: 'Try adjusting your search criteria',
    fr: 'Essayez d\'ajuster vos critères de recherche',
    ar: 'حاول تعديل معايير البحث'
  },
  searchResults: {
    en: 'Search Results',
    fr: 'Résultats de Recherche',
    ar: 'نتائج البحث'
  },
  directMatches: {
    en: 'Direct Matches',
    fr: 'Correspondances Directes',
    ar: 'المطابقات المباشرة'
  },
  otherRoutesBetween: {
    en: 'Other Routes Between',
    fr: 'Autres Itinéraires Entre',
    ar: 'طرق أخرى بين'
  },
  and: {
    en: 'and',
    fr: 'et',
    ar: 'و'
  },
  // City translations
  cities: {
    // Algeria
    'Algiers': { en: 'Algiers', fr: 'Alger', ar: 'الجزائر' },
    'Alger': { en: 'Algiers', fr: 'Alger', ar: 'الجزائر' },
    'Oran': { en: 'Oran', fr: 'Oran', ar: 'وهران' },
    'Constantine': { en: 'Constantine', fr: 'Constantine', ar: 'قسنطينة' },
    'Annaba': { en: 'Annaba', fr: 'Annaba', ar: 'عنابة' },
    'Tlemcen': { en: 'Tlemcen', fr: 'Tlemcen', ar: 'تلمسان' },
    'Béjaïa': { en: 'Béjaïa', fr: 'Béjaïa', ar: 'بجاية' },
    
    // Tunisia
    'Tunis': { en: 'Tunis', fr: 'Tunis', ar: 'تونس' },
    'Sfax': { en: 'Sfax', fr: 'Sfax', ar: 'صفاقس' },
    'Sousse': { en: 'Sousse', fr: 'Sousse', ar: 'سوسة' },
    'Monastir': { en: 'Monastir', fr: 'Monastir', ar: 'المنستير' },
    'Bizerte': { en: 'Bizerte', fr: 'Bizerte', ar: 'بنزرت' },
    
    // Morocco
    'Casablanca': { en: 'Casablanca', fr: 'Casablanca', ar: 'الدار البيضاء' },
    'Rabat': { en: 'Rabat', fr: 'Rabat', ar: 'الرباط' },
    'Marrakech': { en: 'Marrakech', fr: 'Marrakech', ar: 'مراكش' },
    'Fès': { en: 'Fès', fr: 'Fès', ar: 'فاس' },
    'Tangier': { en: 'Tangier', fr: 'Tanger', ar: 'طنجة' },
    'Agadir': { en: 'Agadir', fr: 'Agadir', ar: 'أكادير' },
    
    // France
    'Paris': { en: 'Paris', fr: 'Paris', ar: 'باريس' },
    'Marseille': { en: 'Marseille', fr: 'Marseille', ar: 'مرسيليا' },
    'Lyon': { en: 'Lyon', fr: 'Lyon', ar: 'ليون' },
    'Toulouse': { en: 'Toulouse', fr: 'Toulouse', ar: 'تولوز' },
    'Nice': { en: 'Nice', fr: 'Nice', ar: 'نيس' },
    
    // Spain
    'Madrid': { en: 'Madrid', fr: 'Madrid', ar: 'مدريد' },
    'Barcelona': { en: 'Barcelona', fr: 'Barcelone', ar: 'برشلونة' },
    'Valencia': { en: 'Valencia', fr: 'Valence', ar: 'بلنسية' },
    'Seville': { en: 'Seville', fr: 'Séville', ar: 'إشبيلية' },
    
    // Italy
    'Rome': { en: 'Rome', fr: 'Rome', ar: 'روما' },
    'Milan': { en: 'Milan', fr: 'Milan', ar: 'ميلانو' },
    'Naples': { en: 'Naples', fr: 'Naples', ar: 'نابولي' },
    'Palermo': { en: 'Palermo', fr: 'Palerme', ar: 'باليرمو' },
    
    // Germany
    'Berlin': { en: 'Berlin', fr: 'Berlin', ar: 'برلين' },
    'Frankfurt': { en: 'Frankfurt', fr: 'Francfort', ar: 'فرانكفورت' },
    
    // Other European cities
    'Brussels': { en: 'Brussels', fr: 'Bruxelles', ar: 'بروكسل' },
    'Amsterdam': { en: 'Amsterdam', fr: 'Amsterdam', ar: 'أمستردام' },
    'Geneva': { en: 'Geneva', fr: 'Genève', ar: 'جنيف' },
    'Zurich': { en: 'Zurich', fr: 'Zurich', ar: 'زيورخ' },
    'Vienna': { en: 'Vienna', fr: 'Vienne', ar: 'فيينا' },
    'Lisbon': { en: 'Lisbon', fr: 'Lisbonne', ar: 'لشبونة' },
    'Stockholm': { en: 'Stockholm', fr: 'Stockholm', ar: 'ستوكهولم' },
    'Copenhagen': { en: 'Copenhagen', fr: 'Copenhague', ar: 'كوبنهاغن' }
  },
  // Country translations
  countries: {
    'Algeria': { en: 'Algeria', fr: 'Algérie', ar: 'الجزائر' },
    'Tunisia': { en: 'Tunisia', fr: 'Tunisie', ar: 'تونس' },
    'Morocco': { en: 'Morocco', fr: 'Maroc', ar: 'المغرب' },
    'France': { en: 'France', fr: 'France', ar: 'فرنسا' },
    'Spain': { en: 'Spain', fr: 'Espagne', ar: 'إسبانيا' },
    'Italy': { en: 'Italy', fr: 'Italie', ar: 'إيطاليا' },
    'Germany': { en: 'Germany', fr: 'Allemagne', ar: 'ألمانيا' },
    'Belgium': { en: 'Belgium', fr: 'Belgique', ar: 'بلجيكا' },
    'Netherlands': { en: 'Netherlands', fr: 'Pays-Bas', ar: 'هولندا' },
    'Switzerland': { en: 'Switzerland', fr: 'Suisse', ar: 'سويسرا' },
    'Austria': { en: 'Austria', fr: 'Autriche', ar: 'النمسا' },
    'Portugal': { en: 'Portugal', fr: 'Portugal', ar: 'البرتغال' },
    'Sweden': { en: 'Sweden', fr: 'Suède', ar: 'السويد' },
    'Denmark': { en: 'Denmark', fr: 'Danemark', ar: 'الدنمارك' }
  },
  availableKg: {
    en: 'Available',
    fr: 'Disponible',
    ar: 'متاح'
  },
  kg: {
    en: 'kg',
    fr: 'kg',
    ar: 'كغ'
  },
  popularRoutes: {
    en: 'Popular Routes',
    fr: 'Routes Populaires', 
    ar: 'الطرق الشائعة'
  },
  discoverRoutes: {
    en: 'Discover the most searched travel routes',
    fr: 'Découvrez les itinéraires de voyage les plus recherchés',
    ar: 'اكتشف طرق السفر الأكثر بحثاً'
  },
  departure: {
    en: 'Departure',
    fr: 'Départ',
    ar: 'المغادرة'
  },
  arrival: {
    en: 'Arrival',
    fr: 'Arrivée',
    ar: 'الوصول'
  },
  pickupAvailable: {
    en: 'Pickup Available',
    fr: 'Collecte Disponible',
    ar: 'الاستلام متاح'
  },
  dropoffAvailable: {
    en: 'Dropoff Available',
    fr: 'Livraison Disponible',
    ar: 'التسليم متاح'
  },
  pickupDropoffAvailable: {
    en: 'Pickup & Dropoff Available',
    fr: 'Collecte et Livraison Disponibles',
    ar: 'الاستلام والتسليم متاحان'
  },
  telephone: {
    en: 'Telephone',
    fr: 'Téléphone',
    ar: 'هاتف'
  },
  pickup: {
    en: 'Pickup',
    fr: 'Collecte',
    ar: 'الاستلام'
  },
  dropoff: {
    en: 'Dropoff',
    fr: 'Livraison',
    ar: 'التسليم'
  },
  address: {
    en: 'Address',
    fr: 'Adresse',
    ar: 'العنوان'
  },
  availabilityTime: {
    en: 'Available',
    fr: 'Disponible',
    ar: 'متاح'
  },
  instructions: {
    en: 'Instructions',
    fr: 'Instructions',
    ar: 'تعليمات'
  },
  traveler: {
    en: 'Traveler',
    fr: 'Voyageur',
    ar: 'المسافر'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    return translation ? translation[language] : key;
  };

  const translateCity = (cityName: string): string => {
    const cityTranslations = translations.cities as any;
    const cityTranslation = cityTranslations[cityName];
    return cityTranslation ? cityTranslation[language] : cityName;
  };

  const translateCountry = (countryName: string): string => {
    const countryTranslations = translations.countries as any;
    const countryTranslation = countryTranslations[countryName];
    return countryTranslation ? countryTranslation[language] : countryName;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateCity, translateCountry }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
