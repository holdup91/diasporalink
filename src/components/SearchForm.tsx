//src/components/SearchForm.tsx

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SearchFilters } from '../types';
import { AutocompleteInput } from './AutocompleteInput';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState<SearchFilters>({
    origin: '',
    destination: '',
    departureDate: '' // Keep for compatibility but don't show in UI
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const isRTL = language === 'ar';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('searchTitle')}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'md:flex md:flex-row-reverse' : ''}`}>
          <div>
            <AutocompleteInput
              value={filters.origin}
             onChange={(value) => setFilters({ ...filters, origin: value })}
              placeholder="Oran, Algeria"
              label={t('from')}
              isRTL={isRTL}
            />
          </div>
          
          <div>
            <AutocompleteInput
              value={filters.destination}
             onChange={(value) => setFilters({ ...filters, destination: value })}
              placeholder="Barcelona, Spain"
              label={t('to')}
              isRTL={isRTL}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>{t('search')}</span>
        </button>
      </form>
    </div>
  );
}
