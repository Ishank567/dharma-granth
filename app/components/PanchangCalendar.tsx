'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  Moon,
  Sparkles,
  Sun,
  Star,
} from 'lucide-react';
import { KineticCard } from '@/app/components/motion/KineticCard';

const MS_PER_DAY = 86_400_000;
const SYNODIC_MONTH = 29.530588861;
const SIDEREAL_MONTH = 27.321661;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);
const J2000 = Date.UTC(2000, 0, 1, 12);

const tithiNames = [
  'Pratipada',
  'Dvitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
  'Purnima',
];

const tithiNamesHi = [
  'प्रतिपदा',
  'द्वितीया',
  'तृतीया',
  'चतुर्थी',
  'पंचमी',
  'षष्ठी',
  'सप्तमी',
  'अष्टमी',
  'नवमी',
  'दशमी',
  'एकादशी',
  'द्वादशी',
  'त्रयोदशी',
  'चतुर्दशी',
  'पूर्णिमा',
];

const nakshatras = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
];

const nakshatrasHi = [
  'अश्विनी',
  'भरणी',
  'कृत्तिका',
  'रोहिणी',
  'मृगशिरा',
  'आर्द्रा',
  'पुनर्वसु',
  'पुष्य',
  'आश्लेषा',
  'मघा',
  'पूर्व फाल्गुनी',
  'उत्तर फाल्गुनी',
  'हस्त',
  'चित्रा',
  'स्वाती',
  'विशाखा',
  'अनुराधा',
  'ज्येष्ठा',
  'मूल',
  'पूर्वाषाढ़ा',
  'उत्तराषाढ़ा',
  'श्रवण',
  'धनिष्ठा',
  'शतभिषा',
  'पूर्व भाद्रपद',
  'उत्तर भाद्रपद',
  'रेवती',
];

const yogas = [
  'Vishkambha',
  'Priti',
  'Ayushman',
  'Saubhagya',
  'Shobhana',
  'Atiganda',
  'Sukarma',
  'Dhriti',
  'Shula',
  'Ganda',
  'Vriddhi',
  'Dhruva',
  'Vyaghata',
  'Harshana',
  'Vajra',
  'Siddhi',
  'Vyatipata',
  'Variyan',
  'Parigha',
  'Shiva',
  'Siddha',
  'Sadhya',
  'Shubha',
  'Shukla',
  'Brahma',
  'Indra',
  'Vaidhriti',
];

const karanas = [
  'Bava',
  'Balava',
  'Kaulava',
  'Taitila',
  'Garaja',
  'Vanija',
  'Vishti',
];

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfLocalDay(next);
}

function daysBetween(date: Date, epoch: number): number {
  return (startOfLocalDay(date).getTime() - epoch) / MS_PER_DAY;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getRitu(date: Date): { en: string; hi: string; note: string } {
  const month = date.getMonth();

  if (month === 2 || month === 3) {
    return { en: 'Vasanta', hi: 'वसन्त', note: 'renewal, learning, clarity' };
  }
  if (month === 4 || month === 5) {
    return { en: 'Grishma', hi: 'ग्रीष्म', note: 'discipline, restraint, energy' };
  }
  if (month === 6 || month === 7) {
    return { en: 'Varsha', hi: 'वर्षा', note: 'patience, nourishment, reflection' };
  }
  if (month === 8 || month === 9) {
    return { en: 'Sharad', hi: 'शरद्', note: 'purity, devotion, balance' };
  }
  if (month === 10 || month === 11) {
    return { en: 'Hemanta', hi: 'हेमन्त', note: 'strength, preparation, steadiness' };
  }
  return { en: 'Shishira', hi: 'शिशिर', note: 'quiet study, inwardness, rest' };
}

function calculatePanchang(date: Date) {
  const daysFromNewMoon = daysBetween(date, NEW_MOON_EPOCH);
  const lunarAge = positiveModulo(daysFromNewMoon, SYNODIC_MONTH);
  const tithiExact = (lunarAge / SYNODIC_MONTH) * 30;
  const tithiNumber = Math.floor(tithiExact) + 1;
  const paksha = tithiNumber <= 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const pakshaHi = tithiNumber <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const tithiIndex = tithiNumber <= 15 ? tithiNumber - 1 : tithiNumber - 16;
  const tithiName =
    tithiNumber === 30 ? 'Amavasya' : tithiNames[tithiIndex] ?? 'Pratipada';
  const tithiNameHi =
    tithiNumber === 30 ? 'अमावस्या' : tithiNamesHi[tithiIndex] ?? 'प्रतिपदा';

  const daysFromJ2000 = daysBetween(date, J2000);
  const moonLongitude = positiveModulo(
    218.316 + (daysFromJ2000 / SIDEREAL_MONTH) * 360,
    360,
  );
  const sunLongitude = positiveModulo(280.46 + 0.9856474 * daysFromJ2000, 360);
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));
  const yogaIndex = Math.floor(
    positiveModulo(moonLongitude + sunLongitude, 360) / (360 / 27),
  );
  const halfTithi = Math.floor(tithiExact * 2);
  const karana =
    halfTithi === 0
      ? 'Kimstughna'
      : halfTithi === 57
        ? 'Shakuni'
        : halfTithi === 58
          ? 'Chatushpada'
          : halfTithi === 59
            ? 'Naga'
            : karanas[(halfTithi - 1) % karanas.length];
  const phase = lunarAge / SYNODIC_MONTH;
  const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);
  const tithiProgress = Math.round((tithiExact % 1) * 100);

  return {
    tithiNumber,
    tithiName,
    tithiNameHi,
    paksha,
    pakshaHi,
    nakshatra: nakshatras[nakshatraIndex],
    nakshatraHi: nakshatrasHi[nakshatraIndex],
    yoga: yogas[yogaIndex],
    karana,
    illumination,
    tithiProgress,
    ritu: getRitu(date),
  };
}

function getWeekDays(center: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(center, index - 3));
}

export function PanchangCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setSelectedDate(startOfLocalDay(new Date()));
  }, []);

  const panchang = useMemo(
    () => (selectedDate ? calculatePanchang(selectedDate) : null),
    [selectedDate],
  );
  const weekDays = useMemo(
    () => (selectedDate ? getWeekDays(selectedDate) : []),
    [selectedDate],
  );

  if (!selectedDate || !panchang) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-xl border border-dharma-border bg-dharma-card p-8 text-center text-dharma-muted shadow-sm">
          Loading Panchang calendar...
        </div>
      </section>
    );
  }

  const mainCards = [
    {
      label: 'Tithi',
      hi: 'तिथि',
      value: `${panchang.tithiName} ${panchang.tithiNumber}`,
      subValue: panchang.tithiNameHi,
      detail: 'The lunar day for daily vrata, study, and reflection.',
      icon: <Moon className="h-5 w-5" />,
    },
    {
      label: 'Paksha',
      hi: 'पक्ष',
      value: panchang.paksha,
      subValue: panchang.pakshaHi,
      detail:
        panchang.tithiNumber <= 15
          ? 'Waxing fortnight: growth, learning, beginning.'
          : 'Waning fortnight: release, review, simplification.',
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: 'Nakshatra',
      hi: 'नक्षत्र',
      value: panchang.nakshatra,
      subValue: panchang.nakshatraHi,
      detail: 'The Moon’s star mansion, used as the day’s symbolic mood.',
      icon: <CalendarDays className="h-5 w-5" />,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <FadeShell>
        <motion.div
          className="overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-saffron-900 via-saffron-700 to-amber-600 p-6 text-white md:p-8">
              <FloatingParticles />
              <motion.div
                className="absolute inset-0 mandala-bg opacity-15"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={reduce ? undefined : { duration: 120, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.p
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-saffron-100"
                      animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
                      transition={reduce ? undefined : { duration: 2, repeat: Infinity }}
                    >
                      <motion.span
                        className="inline-flex"
                        animate={reduce ? undefined : { rotate: 360 }}
                        transition={reduce ? undefined : { duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Sun className="h-3.5 w-3.5" />
                      </motion.span>
                      पंचांग Calendar
                    </motion.p>
                    <h2 className="mt-4 text-3xl font-serif font-bold md:text-4xl">
                      Today&apos;s Study Rhythm
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                      A clear Panchang-inspired view for daily scripture reading,
                      vrata awareness, and seasonal reflection.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={selectedDate.toDateString()}
                      className="text-sm font-semibold text-saffron-100"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatDate(selectedDate)}
                    </motion.p>
                  </AnimatePresence>
                  <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5">
                    <motion.div
                      className="relative flex h-28 w-28 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#fde68a ${panchang.illumination}%, rgba(255,255,255,0.16) ${panchang.illumination}% 100%)`,
                      }}
                      animate={reduce ? undefined : { rotate: 360 }}
                      transition={reduce ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.div
                        className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-saffron-950/80 text-center shadow-inner"
                        animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
                        transition={reduce ? undefined : { duration: 3, repeat: Infinity }}
                      >
                        <motion.div
                          animate={reduce ? undefined : { rotate: -360 }}
                          transition={reduce ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Moon className="h-5 w-5 text-saffron-200" />
                        </motion.div>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={panchang.illumination}
                            className="mt-1 text-xl font-bold"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                          >
                            {panchang.illumination}%
                          </motion.span>
                        </AnimatePresence>
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={
                          reduce
                            ? undefined
                            : {
                                boxShadow: [
                                  `0 0 20px rgba(253, 230, 138, 0.3)`,
                                  `0 0 40px rgba(253, 230, 138, 0.5)`,
                                  `0 0 20px rgba(253, 230, 138, 0.3)`,
                                ],
                              }
                        }
                        transition={reduce ? undefined : { duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-saffron-100/80">
                        Moon Light
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={panchang.paksha}
                          className="mt-1 text-2xl font-serif font-bold"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {panchang.paksha}
                        </motion.p>
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={panchang.pakshaHi}
                          className="mt-2 font-devanagari text-lg text-saffron-100"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.3, delay: 0.05 }}
                        >
                          {panchang.pakshaHi}
                        </motion.p>
                      </AnimatePresence>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                        <motion.div
                          className="h-full rounded-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${panchang.tithiProgress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={panchang.tithiProgress}
                          className="mt-2 text-xs text-white/70"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {panchang.tithiProgress}% through this tithi
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-5 flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setSelectedDate((date) => addDays(date ?? new Date(), -1))}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setSelectedDate(startOfLocalDay(new Date()))}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-saffron-800 transition hover:bg-saffron-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Today
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setSelectedDate((date) => addDays(date ?? new Date(), 1))}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                {mainCards.map((card, index) => (
                  <KineticCard
                    key={card.label}
                    className="h-full overflow-hidden rounded-xl border border-dharma-border bg-dharma-bg shadow-sm"
                    contentClassName="p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    rotate={4}
                    depth={20}
                    lift={4}
                    hoverScale={1.012}
                    hoverShadow="0 20px 45px -26px rgba(124, 45, 18, 0.32)"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <motion.div
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-100 text-saffron-700"
                        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                      >
                        {card.icon}
                      </motion.div>
                      <p className="text-xs font-bold uppercase tracking-widest text-dharma-muted">
                        {card.hi}
                      </p>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={card.value}
                        className="font-serif text-lg font-bold text-dharma-text"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {card.value}
                      </motion.h3>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={card.subValue}
                        className="mt-1 font-devanagari text-sm text-saffron-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                      >
                        {card.subValue}
                      </motion.p>
                    </AnimatePresence>
                    <p className="mt-3 text-xs leading-relaxed text-dharma-muted">
                      {card.detail}
                    </p>
                  </KineticCard>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.85fr]">
                <motion.div
                  className="rounded-xl border border-dharma-border bg-dharma-bg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-dharma-muted">
                        Week View
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-bold text-dharma-text">
                        Lunar flow at a glance
                      </h3>
                    </div>
                    <motion.div
                      animate={reduce ? undefined : { rotate: 360 }}
                      transition={reduce ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock3 className="h-5 w-5 text-saffron-600" />
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => {
                      const dayPanchang = calculatePanchang(day);
                      const isSelected =
                        day.toDateString() === selectedDate.toDateString();

                      return (
                        <motion.button
                          key={day.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(day)}
                          className={`rounded-lg border p-2 text-center transition ${
                            isSelected
                              ? 'border-saffron-500 bg-saffron-600 text-white shadow-md'
                              : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300 hover:bg-saffron-500/10'
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="block text-[10px] font-bold uppercase opacity-75">
                            {new Intl.DateTimeFormat('en-IN', {
                              weekday: 'short',
                            }).format(day)}
                          </span>
                          <span className="mt-1 block text-lg font-bold">
                            {day.getDate()}
                          </span>
                          <span className="mt-1 block truncate text-[10px] font-semibold opacity-80">
                            T{dayPanchang.tithiNumber}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-xl border border-dharma-border bg-dharma-bg p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-dharma-muted">
                    More Panchang Angas
                  </p>
                  <dl className="mt-4 space-y-3">
                    {[
                      ['Yoga', panchang.yoga],
                      ['Karana', panchang.karana],
                      ['Ritu', `${panchang.ritu.en} · ${panchang.ritu.hi}`],
                    ].map(([label, value], index) => (
                      <motion.div
                        key={label}
                        className="flex items-center justify-between gap-4 rounded-lg bg-dharma-card px-3 py-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 146, 60, 0.1)" }}
                      >
                        <dt className="text-xs font-bold uppercase tracking-widest text-dharma-muted">
                          {label}
                        </dt>
                        <AnimatePresence mode="wait">
                          <motion.dd
                            key={value}
                            className="text-right text-sm font-semibold text-dharma-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {value}
                          </motion.dd>
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </dl>
                  <motion.p
                    className="mt-4 text-sm leading-relaxed text-dharma-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Seasonal cue: {panchang.ritu.note}. Use it as a simple
                    prompt for choosing what to read today.
                  </motion.p>
                </motion.div>
              </div>

              <motion.div
                className="mt-5 rounded-xl border border-dashed border-dharma-border bg-dharma-bg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex gap-3">
                  <motion.div
                    animate={reduce ? undefined : { rotate: [0, 5, -5, 0] }}
                    transition={reduce ? undefined : { duration: 2, repeat: Infinity }}
                  >
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" />
                  </motion.div>
                  <p className="text-sm leading-relaxed text-dharma-muted">
                    This is an educational Panchang approximation for visual
                    study. Exact Panchang values depend on location, sunrise,
                    ayanamsha, and astronomical calculations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </FadeShell>
    </section>
  );
}

function FadeShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function FloatingParticles() {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    if (reduce) return;
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 4,
      })),
    );
  }, [reduce]);

  if (reduce) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
