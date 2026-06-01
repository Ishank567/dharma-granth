# Guide: Adding Missing Verses from Reliable Sources

## Quick Start - Run Existing Seeders

The project already has seeding scripts that fetch from **sanskritdocuments.org**:

```bash
# Seed all missing scriptures
npm run seed:missing

# Or seed specific texts
npm run seed:gita
npm run seed:ramayana
npm run seed:vedas
npm run seed:puranas
npm run seed:upanishads
npm run seed:mahabharata
```

## Current Status (from analysis)

**Completely Seeded:**
- ✅ Bhagavad Gita (18 chapters, 701 verses)
- ✅ Ramayana (complete)
- ✅ Ramcharitmanas (complete)
- ✅ Mahabharata (complete)
- ✅ Rig Veda, Sama Veda, Yajur Veda, Atharva Veda

**Partially Seeded (need more chapters):**
- ⚠️ Durga Saptashati (13 curated, only 1 in JSON)
- ⚠️ Ravana Samhita (19 curated, 0 in JSON)
- ⚠️ Yoga Vasishtha (6 curated, 1 in JSON)
- ⚠️ 20+ other scriptures

## Reliable Web Sources

### 1. Sanskrit Documents (Primary Source - Already Used)
- **URL:** https://sanskritdocuments.org
- **Format:** ITRANS (.itx files)
- **License:** Public domain Sanskrit texts
- **Coverage:** Upanishads, Puranas, Vedas, Stotras

### 2. Gita Supersite (IIT Kanpur)
- **URL:** https://gitasupersite.iitk.ac.in
- **Format:** Web API / Scrapable
- **Coverage:** Bhagavad Gita (complete with commentary), 10 Upanishads
- **License:** Academic use

### 3. Sacred Texts
- **URL:** https://www.sacred-texts.com/hin/
- **Format:** HTML / Text
- **Coverage:** Puranas, Itihasa, various texts

### 4. Wisdom Library
- **URL:** https://www.wisdomlib.org/hinduism/
- **Format:** Structured web content
- **Coverage:** Puranas, dharma texts
- **License:** CC-BY-SA (check terms)

### 5. Hindi Wikisource
- **URL:** https://sa.wikisource.org
- **Coverage:** Sanskrit texts with Hindi translations
- **License:** CC-BY-SA

### 6. GRETIL (University of Goettingen)
- **URL:** http://gretil.sub.uni-goettingen.de
- **Format:** Plain text, various encodings
- **Coverage:** Comprehensive Sanskrit library
- **License:** Academic research

## How to Add a New Scripture

### Option 1: Using the Seeder (Recommended)

Add a new seeder function to `scripts/seed-missing.ts`:

```typescript
async function seedYourScripture(): Promise<FullScripture> {
  log("Fetching Your Scripture...");
  
  // Fetch from sanskritdocuments.org
  const url = `https://sanskritdocuments.org/doc_category/filename.itx`;
  const raw = await fetchText(url);
  const body = cleanItx(raw);
  
  // Parse based on text type
  const { chapters, totalVerses } = parseAsPurana(body); // or parseAsUpanishad
  
  log(`  ${chapters.length} chapters · ${totalVerses} verses`);
  
  return {
    id: "scripture-id",
    title: "Scripture Title",
    titleSanskrit: "संस्कृत शीर्षक",
    category: "purana", // or upanishad, veda, etc.
    source: {
      repo: url,
      license: "Sanskrit mūla — public domain",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };
}
```

Then add it to the `main()` function:

```typescript
async function main() {
  // ... existing seeders ...
  
  // Add your new seeder
  try {
    const data = await seedYourScripture();
    await writeScripture(data);
  } catch (err) {
    console.error("Failed to seed your scripture:", err);
  }
}
```

### Option 2: Manual JSON Creation

Create a JSON file in `public/data/scriptures-full/{scripture-id}.json`:

```json
{
  "id": "scripture-id",
  "title": "Scripture Title",
  "titleSanskrit": "संस्कृत शीर्षक",
  "category": "purana",
  "source": {
    "repo": "https://source-url",
    "license": "Public domain",
    "fetchedAt": "2026-05-17T00:00:00Z"
  },
  "totalVerses": 100,
  "totalChapters": 5,
  "chapters": [
    {
      "number": 1,
      "title": "Chapter 1 Title",
      "titleSanskrit": "अध्याय १",
      "verses": [
        {
          "number": 1,
          "sanskrit": "संस्कृत श्लोक",
          "transliteration": "Transliteration in IAST",
          "translation": "English translation",
          "hindi": "हिंदी अनुवाद (optional)"
        }
      ]
    }
  ]
}
```

### Option 3: Add Curated Verses (TypeScript)

Edit the curated data in `data/scriptures/{scripture}.ts`:

```typescript
{
  id: 1,
  sanskrit: "संस्कृत श्लोक",
  transliteration: "Transliteration",
  translation: "English translation",
  hindi: "हिंदी अनुवाद",  // <-- Add this
  explanation: "Detailed explanation",
  science: "Scientific insight",
  lifeLesson: "Practical application",
  keywords: ["tag1", "tag2"]
}
```

## Priority List for Adding Verses

Based on user interest and completeness:

1. **High Priority:**
   - Ravana Samhita (19 chapters missing)
   - Durga Saptashati (12 chapters missing)
   - Narada Purana (6 chapters missing)
   - Vishnu Purana (needs proper seeding)

2. **Medium Priority:**
   - Skanda Purana
   - Vamana Purana
   - Varaha Purana
   - Kurma Purana
   - Matsya Purana

3. **Low Priority (smaller texts):**
   - Yoga Vasistha chapters
   - Shiva Samhita
   - Various Upanishads

## Data Quality Checklist

Before adding verses, ensure:

- [ ] Sanskrit text is accurate (Devanagari)
- [ ] Transliteration follows IAST standard
- [ ] Translation is clear and accurate
- [ ] Hindi translation uses correct Devanagari
- [ ] Verse numbers are sequential
- [ ] Source is cited (URL or book reference)
- [ ] License allows redistribution (prefer public domain)

## Verification Commands

After adding verses:

```bash
# Check data integrity
npm run check

# Type check
npm run typecheck

# Build the project
npm run build
```

## Getting Help

If a specific text isn't available on sanskritdocuments.org:

1. Check GRETIL: http://gretil.sub.uni-goettingen.de/gretil.html
2. Search Digital Library of India
3. Check university Sanskrit departments
4. Consider OCR from scanned PDFs (last resort)

## Example: Adding One Verse Manually

To add a single verse to an existing chapter in `data/scriptures/bhagavadgita.ts`:

```typescript
// Find the chapter
{
  id: 2, // Chapter 2
  verses: [
    // ... existing verses ...
    {
      id: 47, // New verse number
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...",
      transliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana...",
      translation: "You have a right to perform your prescribed duty...",
      hindi: "कर्म करने में तुम्हारा अधिकार है, फल में नहीं...",
      explanation: "This famous verse teaches detachment from results...",
      science: "Psychological research on process-oriented thinking...",
      lifeLesson: "Focus on the effort, not the outcome...",
      keywords: ["Karma Yoga", "Detachment", "Process"]
    }
  ]
}
```

---

**Need help with a specific scripture?** 
Provide the scripture name and preferred source, and I can help create the seeder function or manual data entry template.
