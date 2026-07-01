'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, BookOpen, ChevronDown } from 'lucide-react';

interface SearchResult {
  id: string;
  scriptureId: string;
  chapterId: number;
  verseNumber: number | string;
  sanskrit?: string;
  hindi?: string;
  english?: string;
  category?: string;
}

interface AdvancedSearchProps {
  scriptures: any[];
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

const categories = ['All', 'Upanishad', 'Gita', 'Vedanta', 'Yoga', 'Bhakti', 'Karma', 'Knowledge'];
const languages = ['All', 'Sanskrit', 'Hindi', 'English'];

export function AdvancedSearch({ scriptures, onResultClick, className = '' }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('All');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search with delay
    const timer = setTimeout(() => {
      const searchResults: SearchResult[] = [];
      
      scriptures.forEach((scripture: any) => {
        scripture.chapters?.forEach((chapter: any) => {
          chapter.verses?.forEach((verse: any) => {
            const matchesQuery = 
              (verse.sanskrit && verse.sanskrit.toLowerCase().includes(query.toLowerCase())) ||
              (verse.hindi && verse.hindi.toLowerCase().includes(query.toLowerCase())) ||
              (verse.translation && verse.translation.toLowerCase().includes(query.toLowerCase())) ||
              (verse.explanation && verse.explanation.toLowerCase().includes(query.toLowerCase()));
            
            const matchesCategory = category === 'All' || scripture.category === category;
            const matchesLanguage = language === 'All' || 
              (language === 'Sanskrit' && verse.sanskrit) ||
              (language === 'Hindi' && verse.hindi) ||
              (language === 'English' && verse.translation);
            
            if (matchesQuery && matchesCategory && matchesLanguage) {
              searchResults.push({
                id: `${scripture.id}-${chapter.id}-${verse.id}`,
                scriptureId: scripture.id,
                chapterId: chapter.id,
                verseNumber: verse.id,
                sanskrit: verse.sanskrit,
                hindi: verse.hindi,
                english: verse.translation,
                category: scripture.category,
              });
            }
          });
        });
      });
      
      setResults(searchResults.slice(0, 10));
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, category, language, scriptures]);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <motion.div
          className="relative flex items-center bg-dharma-card dark:bg-gray-800 border border-dharma-border dark:border-gray-700 rounded-xl overflow-hidden"
          whileFocus={{ scale: 1.01 }}
        >
          <Search className="absolute left-4 w-5 h-5 text-dharma-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verses, keywords, or concepts..."
            className="w-full pl-12 pr-12 py-3 bg-transparent text-dharma-text dark:text-gray-100 placeholder:text-dharma-muted dark:placeholder:text-gray-500 focus:outline-none"
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setQuery('')}
              className="absolute right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-dharma-muted" />
            </motion.button>
          )}
        </motion.div>

        {/* Filter Toggle */}
        <motion.button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Filter className={`w-4 h-4 ${isFilterOpen ? 'text-saffron-600' : 'text-dharma-muted'}`} />
        </motion.button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-3 p-4 bg-dharma-card dark:bg-gray-800 border border-dharma-border dark:border-gray-700 rounded-xl"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-dharma-border dark:border-gray-700 rounded-lg text-dharma-text dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron-500 appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted pointer-events-none" />
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <label className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 block">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-dharma-border dark:border-gray-700 rounded-lg text-dharma-text dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron-500 appearance-none cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-dharma-border dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-8 text-center text-dharma-muted">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 mx-auto mb-3"
                >
                  <Search className="w-full h-full text-saffron-600" />
                </motion.div>
                <p>Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-dharma-muted">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No results found</p>
                <p className="text-sm mt-1">Try different keywords or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-dharma-border dark:divide-gray-700">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onResultClick?.(result);
                      setQuery('');
                    }}
                    className="w-full p-4 text-left hover:bg-saffron-50 dark:hover:bg-saffron-900/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider">
                        {result.scriptureId} · Chapter {result.chapterId} · Verse {result.verseNumber}
                      </span>
                      {result.category && (
                        <span className="text-xs bg-saffron-100 dark:bg-saffron-900/30 text-saffron-800 dark:text-saffron-300 px-2 py-0.5 rounded-full">
                          {result.category}
                        </span>
                      )}
                    </div>
                    {result.sanskrit && (
                      <p className="font-devanagari text-saffron-800 dark:text-saffron-200 mb-1">{result.sanskrit}</p>
                    )}
                    {result.hindi && (
                      <p className="text-sm text-dharma-text dark:text-gray-200 mb-1">{result.hindi}</p>
                    )}
                    {result.english && (
                      <p className="text-sm text-dharma-muted dark:text-gray-400 line-clamp-2">{result.english}</p>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
