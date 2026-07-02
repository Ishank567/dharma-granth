'use client';

import { PenLine, Check } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate, dayOfYear } from './shared';

/** One prompt per day, rotating deterministically through the year. */
const PROMPTS: { en: string; hi: string }[] = [
  { en: 'Where did I act without expecting a result today?', hi: 'आज मैंने कहाँ फल की चिंता किए बिना कर्म किया?' },
  { en: 'What am I holding on to that I could release?', hi: 'मैं किस चीज़ को पकड़े हुए हूँ जिसे छोड़ सकता/सकती हूँ?' },
  { en: 'Who tested my patience — and what did that teach me?', hi: 'किसने मेरे धैर्य की परीक्षा ली — और उससे क्या सीखा?' },
  { en: 'What did I read or hear today that felt true?', hi: 'आज क्या पढ़ा या सुना जो सत्य लगा?' },
  { en: 'Where was I generous today? Where could I have been?', hi: 'आज मैं कहाँ उदार रहा/रही? कहाँ हो सकता/सकती थी?' },
  { en: 'What fear shaped a decision today?', hi: 'आज किस भय ने मेरा कोई निर्णय प्रभावित किया?' },
  { en: 'When did I feel most still today?', hi: 'आज मैं सबसे अधिक शांत कब था/थी?' },
  { en: 'What duty am I avoiding, and why?', hi: 'मैं किस कर्तव्य से बच रहा/रही हूँ, और क्यों?' },
  { en: 'What would I do differently if no one were watching?', hi: 'अगर कोई न देख रहा होता तो मैं क्या अलग करता/करती?' },
  { en: 'What am I attached to that is changing?', hi: 'मैं किस बदलती हुई चीज़ से आसक्त हूँ?' },
  { en: 'Whose wisdom guided me today?', hi: 'आज किसके ज्ञान ने मेरा मार्गदर्शन किया?' },
  { en: 'What did anger cost me this week?', hi: 'इस सप्ताह क्रोध ने मुझसे क्या छीना?' },
  { en: 'Where did I see the same Self in another?', hi: 'मैंने दूसरे में वही आत्मा कहाँ देखी?' },
  { en: 'What small discipline improved my day?', hi: 'किस छोटे अनुशासन ने मेरा दिन बेहतर बनाया?' },
];

/**
 * Daily reflection journal: one rotating prompt, one private answer per day,
 * autosaved locally as you type.
 */
export function DailyReflection() {
  const [entries, setEntries] = useLocalStorage<Record<string, string>>(
    'dharma.practice.reflections',
    {},
  );

  const today = localISODate();
  const prompt = PROMPTS[dayOfYear() % PROMPTS.length];
  const text = entries[today] ?? '';
  const daysWritten = Object.keys(entries).filter((k) => (entries[k] ?? '').trim().length > 0).length;

  return (
    <ToolCard icon={<PenLine className="w-5 h-5" />} title="Daily Reflection" titleHindi="दैनिक चिंतन" accent="rose">
      <div className="flex flex-col gap-3 h-full">
        <blockquote className="border-l-4 border-rose-300 pl-3">
          <p className="text-sm font-semibold text-dharma-text">{prompt.en}</p>
          <p className="font-devanagari text-xs text-dharma-muted mt-0.5">{prompt.hi}</p>
        </blockquote>
        <textarea
          value={text}
          onChange={(e) => setEntries({ ...entries, [today]: e.target.value })}
          placeholder="Write freely — this never leaves your device."
          rows={5}
          className="w-full flex-1 text-sm bg-dharma-panel-muted rounded-xl border border-dharma-border focus:border-rose-300 outline-none p-3 text-dharma-text placeholder:text-dharma-muted resize-y"
          aria-label="Today's reflection"
        />
        <div className="flex items-center justify-between text-xs text-dharma-muted">
          <span className="inline-flex items-center gap-1">
            {text.trim().length > 0 && <Check className="w-3 h-3 text-emerald-600" />}
            {text.trim().length > 0 ? 'Saved on this device' : 'Autosaves as you type'}
          </span>
          <span>{daysWritten} day{daysWritten === 1 ? '' : 's'} written</span>
        </div>
      </div>
    </ToolCard>
  );
}
