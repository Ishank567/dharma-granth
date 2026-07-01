'use client';

import { useState } from 'react';
import { FlashCard, FlashCardData } from '@/app/components/FlashCard';
import { SlideDeck, SlideData } from '@/app/components/SlideDeck';
import { MindMap, MindMapNode } from '@/app/components/MindMap';
import { Timeline, TimelineEvent } from '@/app/components/Timeline';
import { BookOpen, Brain, Sparkles, Clock, Trophy } from 'lucide-react';
import { QuizRunner } from '@/app/components/QuizRunner';
import { quizzes } from '@/data/quizzes';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'slides' | 'mindmap' | 'timeline' | 'quizzes'>('flashcards');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const study = useStudyProgress();
  const [flashcards, setFlashcards] = useState<FlashCardData[]>([
    {
      front: {
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
        transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana',
        question: 'What is the teaching of this verse?',
      },
      back: {
        hindi: 'तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं।',
        english: 'You have a right only to perform your duty; the fruits thereof are not your concern.',
        explanation: 'Focus on the action, not the outcome. This leads to better performance and inner peace.',
        keywords: ['Karma', 'Detachment', 'Flow State'],
      },
    },
    {
      front: {
        sanskrit: 'योगः कर्मसु कौशलम्',
        transliteration: 'yogaḥ karmasu kauśalam',
        question: 'What is Yoga according to the Gita?',
      },
      back: {
        hindi: 'योग कर्मों में कौशल है।',
        english: 'Yoga is skill in action.',
        explanation: 'Excellence in performing duties with complete focus and detachment from results.',
        keywords: ['Yoga', 'Skill', 'Excellence'],
      },
    },
    {
      front: {
        sanskrit: 'त्वं असि अव्ययः',
        transliteration: 'tvaṃ asi avyayaḥ',
        question: 'What is the nature of the Self?',
      },
      back: {
        hindi: 'तुम अविनाशी हो।',
        english: 'You are imperishable.',
        explanation: 'The true Self is eternal and beyond birth and death, like energy that transforms but never ceases.',
        keywords: ['Atman', 'Eternal', 'Consciousness'],
      },
    },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [spacedRepetitionMode, setSpacedRepetitionMode] = useState(false);

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleResetCards = () => {
    setCurrentCardIndex(0);
  };

  const handleShuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
  };

  // Slide deck data
  const slides: SlideData[] = [
    {
      id: '1',
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana',
      hindi: 'तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं।',
      english: 'You have a right only to perform your duty; the fruits thereof are not your concern.',
      explanation: 'This verse teaches the essence of karma yoga - performing actions without attachment to results.',
      keywords: ['Karma Yoga', 'Detachment', 'Focus'],
      science: 'Modern psychology shows that focusing on process rather than outcome improves performance by 40% (Carol Dweck).',
    },
    {
      id: '2',
      sanskrit: 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
      transliteration: 'mā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi',
      hindi: 'न तो कर्म के फल का कारण बनो, और न ही कर्म न करने में आसक्त हो।',
      english: 'Let not the fruit of action be your motive, nor let attachment to inaction take hold of you.',
      explanation: 'Avoid both attachment to results and attachment to inaction. Find the middle path of dedicated action.',
      keywords: ['Balance', 'Action', 'Detachment'],
      science: 'This aligns with Flow State theory - optimal experience occurs when action and awareness merge.',
    },
    {
      id: '3',
      sanskrit: 'योगः कर्मसु कौशलम्',
      transliteration: 'yogaḥ karmasu kauśalam',
      hindi: 'योग कर्मों में कौशल है।',
      english: 'Yoga is skill in action.',
      explanation: 'True yoga is performing every action with excellence, focus, and complete presence.',
      keywords: ['Yoga', 'Skill', 'Excellence'],
      science: 'Deliberate practice and flow states lead to mastery in any field.',
    },
  ];

  // Mindmap data
  const mindmapData: MindMapNode = {
    id: 'root',
    label: 'Karma Yoga',
    labelSanskrit: 'कर्म योग',
    description: 'Path of Selfless Action',
    color: 'saffron',
    children: [
      {
        id: 'nishkama',
        label: 'Nishkama Karma',
        labelSanskrit: 'निष्काम कर्म',
        description: 'Action without desire for fruit',
        color: 'indigo',
        children: [
          { id: 'focus', label: 'Focus on Process', description: 'Attention on action itself' },
          { id: 'detachment', label: 'Detachment from Results', description: 'No attachment to outcomes' },
        ],
      },
      {
        id: 'dharma',
        label: 'Dharma',
        labelSanskrit: 'धर्म',
        description: 'Righteous Duty',
        color: 'emerald',
        children: [
          { id: 'svadharma', label: 'Svadharma', description: 'Personal duty' },
          { id: 'social', label: 'Social Responsibility', description: 'Duty to society' },
        ],
      },
      {
        id: 'yoga',
        label: 'Yoga',
        labelSanskrit: 'योग',
        description: 'Skill in Action',
        color: 'rose',
        children: [
          { id: 'excellence', label: 'Excellence', description: 'Performing with mastery' },
          { id: 'flow', label: 'Flow State', description: 'Complete absorption' },
        ],
      },
    ],
  };

  // Timeline data
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      year: 'c. 5000 BCE',
      title: 'Vedic Period',
      description: 'The Vedas are composed, containing the earliest teachings about dharma and karma.',
      sanskrit: 'वेद काल',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: '2',
      year: 'c. 3100 BCE',
      title: 'Mahabharata War',
      description: 'The historic battle where the Bhagavad Gita was first spoken by Krishna to Arjuna.',
      sanskrit: 'महाभारत युद्ध',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: '3',
      year: 'c. 500 BCE',
      title: 'Upanishadic Period',
      description: 'The Upanishads explore the deeper philosophical concepts of the Vedas.',
      sanskrit: 'उपनिषद् काल',
      icon: <Brain className="w-5 h-5" />,
    },
    {
      id: '4',
      year: 'Modern Era',
      title: 'Scientific Validation',
      description: 'Modern neuroscience and psychology validate ancient wisdom about focus, flow, and consciousness.',
      sanskrit: 'आधुनिक वैज्ञानिक प्रमाण',
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Header */}
      <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h1 className="text-5xl font-serif font-bold mb-4">Interactive Learning</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Explore ancient wisdom through flashcards, slides, mindmaps, and timelines
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex gap-2">
          {[
            { id: 'flashcards' as const, label: 'Flashcards', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'slides' as const, label: 'Slides', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'mindmap' as const, label: 'Mind Map', icon: <Brain className="w-4 h-4" /> },
            { id: 'timeline' as const, label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
            { id: 'quizzes' as const, label: 'Quizzes', icon: <Trophy className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white shadow-md'
                  : 'text-dharma-text hover:bg-saffron-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <FadeUpOnView>
          {activeTab === 'flashcards' && (
            <div className="py-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-dharma-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spacedRepetitionMode}
                      onChange={(e) => setSpacedRepetitionMode(e.target.checked)}
                      className="w-4 h-4 rounded border-dharma-border text-saffron-600 focus:ring-saffron-500"
                    />
                    Spaced Repetition Mode
                  </label>
                </div>
              </div>
              <FlashCard
                data={flashcards[currentCardIndex]}
                onNext={handleNextCard}
                onPrevious={handlePreviousCard}
                onReset={handleResetCards}
                currentIndex={currentCardIndex}
                total={flashcards.length}
                onShuffle={handleShuffleCards}
                spacedRepetitionMode={spacedRepetitionMode}
              />
            </div>
          )}

          {activeTab === 'slides' && (
            <div className="py-8">
              <SlideDeck slides={slides} />
            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="py-8">
              <MindMap data={mindmapData} />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="py-8">
              <Timeline events={timelineEvents} />
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="py-8">
              {selectedQuizId ? (
                <div>
                  <button
                    onClick={() => setSelectedQuizId(null)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
                  >
                    ← Back to quizzes
                  </button>
                  <QuizRunner
                    quiz={quizzes.find((q) => q.id === selectedQuizId)!}
                    onComplete={(score, total) => study.recordQuizResult(selectedQuizId, score, total)}
                    bestScore={study.getBestQuizScore(selectedQuizId)}
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {quizzes.map((quiz) => {
                    const best = study.getBestQuizScore(quiz.id);
                    return (
                      <button
                        key={quiz.id}
                        onClick={() => setSelectedQuizId(quiz.id)}
                        className="text-left rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-amber-100 text-saffron-700 flex items-center justify-center">
                              <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">{quiz.title}</h3>
                              {quiz.titleSanskrit && (
                                <p lang="sa" className="font-devanagari text-sm text-saffron-600">{quiz.titleSanskrit}</p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full '${
                            quiz.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                            quiz.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }'`}>{quiz.difficulty}</span>
                        </div>
                        <p className="text-sm text-dharma-muted leading-relaxed mb-3">{quiz.description}</p>
                        <div className="flex items-center justify-between text-xs text-dharma-muted">
                          <span>{quiz.questions.length} questions</span>
                          {best && (
                            <span className="font-semibold text-saffron-700">
                              Best: {best.score}/{best.total}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </FadeUpOnView>
      </section>
    </main>
  );
}
