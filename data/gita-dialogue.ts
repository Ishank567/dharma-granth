/**
 * Gita Dialogue & Conversation Metadata
 * Canonical speaker assignments and dialogue turns for the Bhagavad Gita:
 * - Dhritarashtra (धृतराष्ट्र)
 * - Sanjaya (सञ्जय)
 * - Arjuna (अर्जुन)
 * - Sri Krishna / Bhagavan (श्रीभगवान्)
 */

export type GitaSpeakerId = 'krishna' | 'arjuna' | 'sanjaya' | 'dhritarashtra';

export interface GitaSpeaker {
  id: GitaSpeakerId;
  nameEn: string;
  nameHi: string;
  roleEn: string;
  roleHi: string;
  badgeIcon: string;
  chipColor: string;
  cardBorder: string;
  bgTint: string;
}

export const GITA_SPEAKERS: Record<GitaSpeakerId, GitaSpeaker> = {
  krishna: {
    id: 'krishna',
    nameEn: 'Shri Krishna',
    nameHi: 'श्रीभगवान् (श्रीकृष्ण)',
    roleEn: 'Divine Teacher & Jagadguru',
    roleHi: 'उपदेशक एवं गुरु',
    badgeIcon: '🪷',
    chipColor: 'border-amber-600/50 bg-amber-100 text-amber-950 dark:border-amber-500/50 dark:bg-amber-900/40 dark:text-amber-100',
    cardBorder: 'border-l-4 border-l-amber-600 border-amber-500/30',
    bgTint: 'bg-amber-50/40 dark:bg-amber-950/20',
  },
  arjuna: {
    id: 'arjuna',
    nameEn: 'Arjuna',
    nameHi: 'अर्जुन',
    roleEn: 'Inquiring Seeker & Warrior',
    roleHi: 'जिज्ञासु शिष्य एवं महारथी',
    badgeIcon: '🏹',
    chipColor: 'border-sky-600/50 bg-sky-100 text-sky-950 dark:border-sky-500/50 dark:bg-sky-900/40 dark:text-sky-100',
    cardBorder: 'border-l-4 border-l-sky-600 border-sky-500/30',
    bgTint: 'bg-sky-50/40 dark:bg-sky-950/20',
  },
  sanjaya: {
    id: 'sanjaya',
    nameEn: 'Sanjaya',
    nameHi: 'सञ्जय',
    roleEn: 'Eyewitness Narrator',
    roleHi: 'प्रत्यक्षदर्शी कथावाचक',
    badgeIcon: '👁️',
    chipColor: 'border-emerald-600/50 bg-emerald-100 text-emerald-950 dark:border-emerald-500/50 dark:bg-emerald-900/40 dark:text-emerald-100',
    cardBorder: 'border-l-4 border-l-emerald-600 border-emerald-500/30',
    bgTint: 'bg-emerald-50/40 dark:bg-emerald-950/20',
  },
  dhritarashtra: {
    id: 'dhritarashtra',
    nameEn: 'Dhritarashtra',
    nameHi: 'धृतराष्ट्र',
    roleEn: 'King & Inquirer',
    roleHi: 'हस्तिनापुर नरेश',
    badgeIcon: '👑',
    chipColor: 'border-stone-600/50 bg-stone-200 text-stone-950 dark:border-stone-500/50 dark:bg-stone-900/40 dark:text-stone-100',
    cardBorder: 'border-l-4 border-l-stone-600 border-stone-500/30',
    bgTint: 'bg-stone-50/40 dark:bg-stone-950/20',
  },
};

/**
 * Returns speaker and listener metadata for any given verse in the Gita.
 */
export function getGitaDialogueTurn(chapter: number, verse: number): {
  speaker: GitaSpeaker;
  listener: GitaSpeaker;
  contextNote?: string;
  contextNoteHi?: string;
} {
  // Chapter 1
  if (chapter === 1) {
    if (verse === 1) {
      return {
        speaker: GITA_SPEAKERS.dhritarashtra,
        listener: GITA_SPEAKERS.sanjaya,
        contextNote: 'Dhritarashtra asks Sanjaya what his sons and Pandu’s sons did at Kurukshetra.',
        contextNoteHi: 'धृतराष्ट्र सञ्जय से कुरुक्षेत्र में एकत्रित सेनाओं के विषय में पूछते हैं।',
      };
    }
    if (verse >= 28 && verse <= 47) {
      return {
        speaker: GITA_SPEAKERS.arjuna,
        listener: GITA_SPEAKERS.krishna,
        contextNote: 'Arjuna speaks in deep sorrow and moral anguish, refusing to fight.',
        contextNoteHi: 'अर्जुन विषादग्रस्त होकर श्रीकृष्ण से युद्ध न करने का तर्क देते हैं।',
      };
    }
    return {
      speaker: GITA_SPEAKERS.sanjaya,
      listener: GITA_SPEAKERS.dhritarashtra,
      contextNote: 'Sanjaya describes the battlefield, conch shells, and armies to Dhritarashtra.',
      contextNoteHi: 'सञ्जय धृतराष्ट्र को कुरुक्षेत्र के दृश्य का वर्णन सुनाते हैं।',
    };
  }

  // Chapter 2
  if (chapter === 2) {
    if (verse >= 1 && verse <= 3) {
      if (verse === 2 || verse === 3) {
        return {
          speaker: GITA_SPEAKERS.krishna,
          listener: GITA_SPEAKERS.arjuna,
          contextNote: 'Krishna reproaches Arjuna for untimely despair.',
          contextNoteHi: 'श्रीकृष्ण अर्जुन को कायरता त्यागने की प्रेरणा देते हैं।',
        };
      }
      return {
        speaker: GITA_SPEAKERS.sanjaya,
        listener: GITA_SPEAKERS.dhritarashtra,
        contextNote: 'Sanjaya narrates Krishna addressing the weeping Arjuna.',
        contextNoteHi: 'सञ्जय अर्जुन की अश्रुपूर्ण अवस्था का वर्णन करते हैं।',
      };
    }
    if (verse >= 4 && verse <= 8) {
      return {
        speaker: GITA_SPEAKERS.arjuna,
        listener: GITA_SPEAKERS.krishna,
        contextNote: 'Arjuna confesses total moral confusion and surrenders as a disciple (2.7).',
        contextNoteHi: 'अर्जुन अपनी दुर्बलता स्वीकार कर श्रीकृष्ण की शरण में आते हैं।',
      };
    }
    if (verse >= 9 && verse <= 10) {
      return {
        speaker: GITA_SPEAKERS.sanjaya,
        listener: GITA_SPEAKERS.dhritarashtra,
        contextNote: 'Sanjaya recounts Arjuna declaring "I will not fight" and sitting down.',
        contextNoteHi: 'सञ्जय बताते हैं कि अर्जुन ने "मैं युद्ध नहीं करूँगा" कहकर मौन साध लिया।',
      };
    }
    if (verse === 54) {
      return {
        speaker: GITA_SPEAKERS.arjuna,
        listener: GITA_SPEAKERS.krishna,
        contextNote: 'Arjuna asks for the characteristics of a person of steady wisdom (Sthitaprajna).',
        contextNoteHi: 'अर्जुन स्थितप्रज्ञ साधक के लक्षण और आचरण के विषय में पूछते हैं।',
      };
    }
    return {
      speaker: GITA_SPEAKERS.krishna,
      listener: GITA_SPEAKERS.arjuna,
      contextNote: 'Krishna delivers the foundational teachings of Sankhya and Karma Yoga.',
      contextNoteHi: 'श्रीकृष्ण आत्मा की अमरता और निष्काम कर्मयोग का उपदेश देते हैं।',
    };
  }

  // Chapter 3
  if (chapter === 3) {
    if (verse === 1 || verse === 2 || verse === 36) {
      return {
        speaker: GITA_SPEAKERS.arjuna,
        listener: GITA_SPEAKERS.krishna,
        contextNote: 'Arjuna seeks clarification on knowledge versus action and the cause of sin.',
        contextNoteHi: 'अर्जुन ज्ञान और कर्म के संशय पर प्रश्न पूछते हैं।',
      };
    }
    return {
      speaker: GITA_SPEAKERS.krishna,
      listener: GITA_SPEAKERS.arjuna,
    };
  }

  // Chapter 4
  if (chapter === 4) {
    if (verse === 4) {
      return {
        speaker: GITA_SPEAKERS.arjuna,
        listener: GITA_SPEAKERS.krishna,
        contextNote: 'Arjuna asks how Krishna taught Vivasvan at the dawn of time.',
        contextNoteHi: 'अर्जुन श्रीकृष्ण के प्राचीन जन्म और ज्ञान-परंपरा पर प्रश्न करते हैं।',
      };
    }
    return {
      speaker: GITA_SPEAKERS.krishna,
      listener: GITA_SPEAKERS.arjuna,
    };
  }

  // Default fallback for rest of Gita: Krishna speaking to Arjuna unless specific Arjuna inquiry
  return {
    speaker: GITA_SPEAKERS.krishna,
    listener: GITA_SPEAKERS.arjuna,
  };
}
