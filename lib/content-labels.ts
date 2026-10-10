/**
 * What each kind of content on a verse page is (original text, explanation,
 * modern reflection…). These describe the *type* of a section so readers can
 * tell scripture from editorial commentary; they say nothing about who edited
 * or reviewed a particular text.
 */

export type ContentLabelKey =
  | 'mula'
  | 'literal'
  | 'commentary'
  | 'explanation'
  | 'reflection'
  | 'research';

export interface ContentLabelDefinition {
  key: ContentLabelKey;
  labelHi: string;
  labelEn: string;
  tagline: string;
  epistemicTier: 'primary_canonical' | 'literal_translation' | 'traditional_lineage' | 'pedagogical' | 'modern_reflection' | 'critical_apparatus';
  description: string;
  visualBadgeClass: string;
  authorityLevel: string;
}

export const CONTENT_LABELS: Record<ContentLabelKey, ContentLabelDefinition> = {
  mula: {
    key: 'mula',
    labelHi: 'मूल पाठ',
    labelEn: 'Original text',
    tagline: 'अपौरुषेय / प्रामाणिक शास्त्र (Primary Canonical Scripture)',
    epistemicTier: 'primary_canonical',
    description: 'मूल संस्कृत, प्राकृत अथवा अवधी श्लोक/मंत्र। यह सर्वोच्च प्रमाण (प्रस्थान) है। इस पाठ में किसी भी आधुनिक व्याख्याकार का हस्तक्षेप नहीं है।',
    authorityLevel: 'सर्वोच्च प्रमाण (Canonical Authority)',
    visualBadgeClass: 'border-amber-600/40 bg-amber-500/10 text-amber-950 dark:border-amber-400/40 dark:bg-amber-950/60 dark:text-amber-100',
  },
  literal: {
    key: 'literal',
    labelHi: 'शाब्दिक अनुवाद',
    labelEn: 'Literal translation',
    tagline: 'पदार्थ व अन्वय (Direct Grammatical & Word-for-Word Meaning)',
    epistemicTier: 'literal_translation',
    description: 'व्याकरणसम्मत प्रत्यक्ष शब्दार्थ (अन्वय)। बिना किसी दार्शनिक संप्रदाय के पूर्वाग्रह के, संस्कृत शब्दों का सटीक भाषांतर।',
    authorityLevel: 'व्याकरणिक प्रामाणिकता (Direct Linguistic Rendering)',
    visualBadgeClass: 'border-slate-400/50 bg-slate-100 text-slate-900 dark:border-slate-600/50 dark:bg-slate-800 dark:text-slate-100',
  },
  commentary: {
    key: 'commentary',
    labelHi: 'पारंपरिक भाष्य',
    labelEn: 'Traditional commentary',
    tagline: 'आचार्य परंपरा व टीका (Classical Lineage Commentary)',
    epistemicTier: 'traditional_lineage',
    description: 'प्राचीन आचार्य परंपरा (यथा शंकराचार्य, रामानुजाचार्य, मध्वाचार्य, श्रीधर स्वामी) द्वारा विरचित शास्त्रीय भाष्य व टीकाएं।',
    authorityLevel: 'सांप्रदायिक व ऐतिहासिक प्रमाण (Classical Hermeneutics)',
    visualBadgeClass: 'border-orange-500/40 bg-orange-500/10 text-orange-950 dark:border-orange-400/40 dark:bg-orange-950/60 dark:text-orange-100',
  },
  explanation: {
    key: 'explanation',
    labelHi: 'सरल व्याख्या',
    labelEn: 'Simple explanation',
    tagline: 'भावार्थ व सुबोध प्रबोधन (Accessible Pedagogical Exposition)',
    epistemicTier: 'pedagogical',
    description: 'आधुनिक जिज्ञासुओं के लिए सरल भाषा में भावार्थ। यह मूल मंत्र नहीं, बल्कि पाठ को सुगम बनाने हेतु संपादकीय व्याख्या है।',
    authorityLevel: 'शैक्षणिक व्याख्या (Pedagogical Guidance — Not Canonical Scripture)',
    visualBadgeClass: 'border-stone-400/50 bg-stone-100 text-stone-900 dark:border-stone-600/50 dark:bg-stone-800 dark:text-stone-100',
  },
  reflection: {
    key: 'reflection',
    labelHi: 'आधुनिक चिंतन',
    labelEn: 'Modern reflection',
    tagline: 'समसामयिक विमर्श व अनुप्रयोग (Contemporary Application & Analysis)',
    epistemicTier: 'modern_reflection',
    description: 'दार्शनिक, मनोवैज्ञानिक व वैज्ञानिक समरूपताओं पर आधुनिक चिंतन। यह मूल शास्त्र का अंग नहीं है और इसे शास्त्रोक्त सिद्धांत के रूप में नहीं देखा जाना चाहिए।',
    authorityLevel: 'समसामयिक विचार (Modern Reflection — Strictly Non-Scriptural)',
    visualBadgeClass: 'border-sky-500/40 bg-sky-100 text-sky-950 dark:border-sky-500/40 dark:bg-sky-950/60 dark:text-sky-100',
  },
  research: {
    key: 'research',
    labelHi: 'शोध टिप्पणी',
    labelEn: 'Research note',
    tagline: 'पांडुलिपि एवं ऐतिहासिक शोध (Critical Apparatus & Manuscript Research)',
    epistemicTier: 'critical_apparatus',
    description: 'पांडुलिपि विविधताएं, पाठ-भेद (variant readings), छंद रचना, और ऐतिहासिक व तुलनात्मक भाषावैज्ञानिक शोध। यह शास्त्र का मूल संदेश बदलने हेतु नहीं, बल्कि पाठ की प्रामाणिकता परखने के लिए है।',
    authorityLevel: 'विद्वत्तापूर्ण शोध (Critical Scholarship — Textual Variants)',
    visualBadgeClass: 'border-purple-500/40 bg-purple-100 text-purple-950 dark:border-purple-500/40 dark:bg-purple-950/60 dark:text-purple-100',
  },
};
