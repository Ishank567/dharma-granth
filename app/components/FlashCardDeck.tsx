'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard, FlashCardData } from './FlashCard';
import { BookOpen, Flame, TreePine, Scale, Heart, ChevronDown, ChevronUp, ChevronLeft, Grid3x3, List, Filter } from 'lucide-react';

export interface FlashCardDeck {
  id: string;
  name: string;
  nameSanskrit?: string;
  description: string;
  category: 'veda' | 'upanishad' | 'itihasa' | 'purana' | 'smriti' | 'other';
  icon: React.ReactNode;
  cards: FlashCardData[];
  color: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface FlashCardDeckSystemProps {
  decks: FlashCardDeck[];
  className?: string;
}

const categoryIcons = {
  veda: <Flame className="w-5 h-5" />,
  upanishad: <BookOpen className="w-5 h-5" />,
  itihasa: <TreePine className="w-5 h-5" />,
  purana: <Scale className="w-5 h-5" />,
  smriti: <Heart className="w-5 h-5" />,
  other: <BookOpen className="w-5 h-5" />,
};

const categoryColors = {
  veda: 'text-orange-700 bg-orange-100 border-orange-200',
  upanishad: 'text-emerald-700 bg-emerald-100 border-emerald-200',
  itihasa: 'text-rose-700 bg-rose-100 border-rose-200',
  purana: 'text-indigo-700 bg-indigo-100 border-indigo-200',
  smriti: 'text-purple-700 bg-purple-100 border-purple-200',
  other: 'text-amber-700 bg-amber-100 border-amber-200',
};

export function FlashCardDeckSystem({ decks, className = '' }: FlashCardDeckSystemProps) {
  const [selectedDeck, setSelectedDeck] = useState<FlashCardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [expandedDeck, setExpandedDeck] = useState<string | null>(null);

  const filteredDecks = filterCategory 
    ? decks.filter(deck => deck.category === filterCategory)
    : decks;

  const handleDeckSelect = (deck: FlashCardDeck) => {
    setSelectedDeck(deck);
    setCurrentCardIndex(0);
  };

  const handleBackToDecks = () => {
    setSelectedDeck(null);
  };

  const handleNext = () => {
    if (selectedDeck && currentCardIndex < selectedDeck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
  };

  const handleShuffle = () => {
    if (selectedDeck) {
      const shuffled = [...selectedDeck.cards].sort(() => Math.random() - 0.5);
      setSelectedDeck({ ...selectedDeck, cards: shuffled });
      setCurrentCardIndex(0);
    }
  };

  // If a deck is selected, show the flashcard view
  if (selectedDeck) {
    return (
      <div className={`flashcard-deck-system ${className}`}>
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackToDecks}
          className="flex items-center gap-2 px-4 py-2 bg-dharma-card border border-dharma-border rounded-full text-sm font-semibold hover:bg-saffron-50/20 transition mb-6 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Decks
        </motion.button>

        {/* Deck header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="text-4xl">{selectedDeck.icon}</div>
            <div>
              {selectedDeck.nameSanskrit && (
                <p lang="sa" className="font-devanagari text-2xl text-saffron-700">
                  {selectedDeck.nameSanskrit}
                </p>
              )}
              <h2 className="text-3xl font-serif font-bold text-dharma-text">
                {selectedDeck.name}
              </h2>
            </div>
          </div>
          <p className="text-dharma-muted max-w-2xl mx-auto">
            {selectedDeck.description}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[selectedDeck.category]}`}>
              {selectedDeck.category.toUpperCase()}
            </span>
            {selectedDeck.difficulty && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                {selectedDeck.difficulty.toUpperCase()}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-saffron-100 text-saffron-800 border border-saffron-200">
              {selectedDeck.cards.length} Cards
            </span>
          </div>
        </motion.div>

        {/* Flash Card */}
        <FlashCard
          data={selectedDeck.cards[currentCardIndex]}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onReset={handleReset}
          currentIndex={currentCardIndex}
          total={selectedDeck.cards.length}
          onShuffle={handleShuffle}
          spacedRepetitionMode={true}
        />
      </div>
    );
  }

  // Show deck selection view
  return (
    <div className={`flashcard-deck-system ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-700 bg-gradient-to-r from-saffron-100 to-amber-100 border border-saffron-200 px-5 py-2 rounded-full shadow-sm mb-6"
        >
          <Grid3x3 className="w-3.5 h-3.5" />
          Flashcard Decks
        </motion.div>
        <h2 className="text-4xl font-serif font-bold text-dharma-text mb-4">
          Learn with Flashcards
        </h2>
        <p className="text-dharma-muted text-lg max-w-2xl mx-auto">
          Master key verses and concepts through interactive flashcard decks
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-dharma-card border border-dharma-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
              viewMode === 'grid' 
                ? 'bg-saffron-500 text-white' 
                : 'text-dharma-text hover:bg-saffron-50/20'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
              viewMode === 'list' 
                ? 'bg-saffron-500 text-white' 
                : 'text-dharma-text hover:bg-saffron-50/20'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-dharma-muted" />
          <select
            value={filterCategory || 'all'}
            onChange={(e) => setFilterCategory(e.target.value === 'all' ? null : e.target.value)}
            className="px-4 py-2 bg-dharma-card border border-dharma-border rounded-lg text-sm font-semibold text-dharma-text focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            <option value="all">All Categories</option>
            <option value="veda">Vedas</option>
            <option value="upanishad">Upanishads</option>
            <option value="itihasa">Itihasa</option>
            <option value="purana">Puranas</option>
            <option value="smriti">Smritis</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Decks grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`bg-white rounded-2xl border-2 shadow-lg cursor-pointer transition-all hover:shadow-2xl hover:scale-105 ${
                  expandedDeck === deck.id 
                    ? `${categoryColors[deck.category]} shadow-2xl scale-105` 
                    : 'border-dharma-border'
                }`}
                onClick={() => {
                  setExpandedDeck(expandedDeck === deck.id ? null : deck.id);
                }}
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{deck.icon}</div>
                    <motion.div
                      animate={{ rotate: expandedDeck === deck.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-dharma-muted" />
                    </motion.div>
                  </div>
                  
                  {deck.nameSanskrit && (
                    <p lang="sa" className="font-devanagari text-xl text-saffron-700 mb-2">
                      {deck.nameSanskrit}
                    </p>
                  )}
                  <h3 className="text-xl font-serif font-bold text-dharma-text mb-2">
                    {deck.name}
                  </h3>
                  <p className="text-sm text-dharma-muted line-clamp-2">
                    {deck.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[deck.category]}`}>
                        {deck.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-dharma-muted font-semibold">
                        {deck.cards.length} cards
                      </span>
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeckSelect(deck);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-saffron-600 to-amber-600 text-white rounded-full text-sm font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start
                    </motion.button>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedDeck === deck.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-dharma-border mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-dharma-muted">Difficulty</span>
                            <span className="font-semibold text-dharma-text">
                              {deck.difficulty || 'Intermediate'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-dharma-muted">Category</span>
                            <span className="font-semibold text-dharma-text capitalize">
                              {deck.category}
                            </span>
                          </div>
                          {deck.difficulty && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-dharma-muted">Level</span>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                deck.difficulty === 'beginner' 
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : deck.difficulty === 'intermediate'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {deck.difficulty}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDecks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`bg-white rounded-xl border-2 shadow-md cursor-pointer transition-all hover:shadow-xl ${
                  expandedDeck === deck.id 
                    ? `${categoryColors[deck.category]} shadow-xl` 
                    : 'border-dharma-border'
                }`}
                onClick={() => {
                  setExpandedDeck(expandedDeck === deck.id ? null : deck.id);
                }}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{deck.icon}</div>
                    <div>
                      {deck.nameSanskrit && (
                        <p lang="sa" className="font-devanagari text-lg text-saffron-700">
                          {deck.nameSanskrit}
                        </p>
                      )}
                      <h3 className="text-xl font-serif font-bold text-dharma-text">
                        {deck.name}
                      </h3>
                      <p className="text-sm text-dharma-muted mt-1">
                        {deck.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[deck.category]}`}>
                        {deck.category.toUpperCase()}
                      </span>
                      <p className="text-xs text-dharma-muted mt-2 font-semibold">
                        {deck.cards.length} cards
                      </p>
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeckSelect(deck);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-saffron-600 to-amber-600 text-white rounded-full text-sm font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedDeck === deck.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-dharma-border mt-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-dharma-muted mb-1">Cards</p>
                            <p className="text-lg font-bold text-dharma-text">{deck.cards.length}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-dharma-muted mb-1">Category</p>
                            <p className="text-lg font-bold text-dharma-text capitalize">{deck.category}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-dharma-muted mb-1">Level</p>
                            <p className="text-lg font-bold text-dharma-text">{deck.difficulty || 'Intermediate'}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: decks.length * 0.1 + 0.3 }}
        className="mt-12 bg-gradient-to-br from-saffron-600 via-amber-600 to-orange-700 rounded-3xl p-8 text-white text-center shadow-2xl"
      >
        <h3 className="text-2xl font-serif font-bold mb-3">
          {decks.reduce((acc, deck) => acc + deck.cards.length, 0)} Total Flashcards
        </h3>
        <p className="opacity-90">
          Across {decks.length} specialized decks for comprehensive learning
        </p>
      </motion.div>
    </div>
  );
}
