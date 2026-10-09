'use client';

interface ManuscriptDividerProps {
  label?: string;
  labelSanskrit?: string;
  ornament?: 'om' | 'lotus' | 'shree' | 'swastika' | 'simple';
  className?: string;
}

export function ManuscriptDivider({
  label,
  labelSanskrit,
  ornament = 'om',
  className = '',
}: ManuscriptDividerProps) {
  const getSymbol = () => {
    switch (ornament) {
      case 'lotus':
        return '🪷';
      case 'shree':
        return '॥ श्रीः ॥';
      case 'simple':
        return '✦';
      case 'om':
      default:
        return '॥ ॐ ॥';
    }
  };

  return (
    <div
      className={`relative my-8 flex items-center justify-center text-center select-none ${className}`}
      role="separator"
      aria-hidden="true"
    >
      {/* Left ornamental rule with manuscript dash and diamond */}
      <div className="flex-1 flex items-center justify-end mr-3">
        <div className="h-[1px] w-full max-w-[140px] bg-gradient-to-r from-transparent via-saffron-300/40 dark:via-saffron-500/30 to-saffron-600/70" />
        <span className="text-[10px] text-saffron-500/60 dark:text-saffron-400/60 ml-1">◆</span>
      </div>

      {/* Center manuscript medallion */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-saffron-300/40 dark:border-saffron-500/30 bg-gradient-to-b from-amber-50/80 to-orange-50/40 dark:from-stone-900/80 dark:to-stone-950/90 shadow-sm backdrop-blur-xs">
        <span className="font-devanagari text-xs md:text-sm font-bold text-saffron-800 dark:text-saffron-300 tracking-wider">
          {getSymbol()}
        </span>
        {(label || labelSanskrit) && (
          <span className="text-xs uppercase tracking-widest font-serif font-semibold text-dharma-text/80">
            {labelSanskrit && <span className="font-devanagari mr-1 text-saffron-700 dark:text-saffron-300">{labelSanskrit}</span>}
            {label && <span>{label}</span>}
          </span>
        )}
      </div>

      {/* Right ornamental rule */}
      <div className="flex-1 flex items-center justify-start ml-3">
        <span className="text-[10px] text-saffron-500/60 dark:text-saffron-400/60 mr-1">◆</span>
        <div className="h-[1px] w-full max-w-[140px] bg-gradient-to-l from-transparent via-saffron-300/40 dark:via-saffron-500/30 to-saffron-600/70" />
      </div>
    </div>
  );
}

/**
 * Palm-leaf header border banner for sacred study headers.
 */
export function PalmLeafBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none opacity-70 select-none py-1 ${className}`}>
      <svg
        className="w-full h-3 text-saffron-700/30 dark:text-saffron-400/25"
        viewBox="0 0 1200 12"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <pattern id="palm-leaf-pattern" width="40" height="12" patternUnits="userSpaceOnUse">
          <path d="M 0 6 Q 10 0, 20 6 Q 30 12, 40 6" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="20" cy="6" r="1.5" />
          <path d="M 10 3 L 10 9 M 30 3 L 30 9" stroke="currentColor" strokeWidth="0.75" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#palm-leaf-pattern)" />
      </svg>
    </div>
  );
}
