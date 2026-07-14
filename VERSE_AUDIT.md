# Verse Audit — `public/data/scriptures-full/*.json`

_Per-verse field completeness across the published scripture JSON corpus._

## Executive summary

| Metric | Value |
|---|---|---|
| Scriptures | 65 |
| Declared verses | 183,150 |
| Loaded verses | 183,150 |
| Not-yet-loaded verses | 0 |
| Empty commentary / explanation | 881 |
| Empty word meaning | 881 |
| Empty Hindi | 624 |
| Critical gaps (core text) | 0 |
| Duplicate verse refs | 0 (0 scriptures) |

## Notes

- **Missing** = `totalVerses` minus actually loaded verses. These scriptures are represented by curated highlights rather than full texts.
- **Critical gaps** are verses missing `sanskrit` or English `translation` (the fields required for rendering a verse at all).
- **Supporting-language gaps** are missing transliteration or Hindi; these do not make the core verse unreadable.
- **Commentary gaps** count both `commentary` and `explanation` fields as empty.
- **Word meaning gaps** count empty `wordMeaning` fields.

## All scriptures

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| agnipuran | Agni Purana | 11043 | 11043 | 0 | 0 | 0 | 0 | 0 | 103 | 103 |
| aitareya | Aitareya Upanishad | 46 | 46 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| amritabindu | Amrita-Bindu Upanishad | 22 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| atharvaveda | Atharva Veda | 5627 | 5627 | 0 | 0 | 0 | 0 | 0 | 39 | 39 |
| bhagavadgita | Bhagavad Gita | 644 | 644 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bhagavatapurana | Bhagavata Purana | 106 | 106 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| brahmandpuran | Brahmanda Purana | 13496 | 13496 | 0 | 0 | 0 | 0 | 0 | 9 | 9 |
| brahmapuran | Brahma Purana | 13443 | 13443 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| brahmasutra | Brahma Sutra | 34 | 34 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| brahmavaivartapuran | Brahmavaivarta Purana | 11 | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| brihadaranyaka | Brihadaranyaka Upanishad | 397 | 397 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| chandogya | Chandogya Upanishad | 618 | 618 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| devibhagavat | Devi Bhagavata Purana | 118 | 118 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| durgasaptashati | Durga Saptashati | 634 | 634 | 0 | 0 | 0 | 0 | 624 | 0 | 0 |
| garudpurana | Garuda Purana | 11877 | 11877 | 0 | 0 | 0 | 0 | 0 | 110 | 110 |
| harivanshpuran | Harivamsha Purana | 5870 | 5870 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| ishavasya | Isha Upanishad | 26 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| jabala | Jabala Upanishad | 8 | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kaivalya | Kaivalya Upanishad | 25 | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kalkipuran | Kalki Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| katha | Katha Upanishad | 124 | 124 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kaushitaki | Kaushitaki Upanishad | 14 | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kena | Kena Upanishad | 40 | 40 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kurmapuran | Kurma Purana | 5572 | 5572 | 0 | 0 | 0 | 0 | 0 | 6 | 6 |
| lingapuran | Linga Purana | 6726 | 6726 | 0 | 0 | 0 | 0 | 0 | 7 | 7 |
| mahabharata | Mahabharata | 32540 | 32540 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| mahanarayana | Mahanarayana Upanishad | 14 | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| maitri | Maitri Upanishad | 15 | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| mandukya | Mandukya Upanishad | 22 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| manusmriti | Manusmriti | 1801 | 1801 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| markandeypuran | Markandeya Purana | 4333 | 4333 | 0 | 0 | 0 | 0 | 0 | 90 | 90 |
| matsyapuran | Matsya Purana | 8330 | 8330 | 0 | 0 | 0 | 0 | 0 | 392 | 392 |
| muktika | Muktika Upanishad | 20 | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| mundaka | Mundaka Upanishad | 73 | 73 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| naradabhaktisutra | Narada Bhakti Sutras | 26 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| naradapuran | Narada Purana | 15198 | 15198 | 0 | 0 | 0 | 0 | 0 | 64 | 64 |
| narasimhapuran | Narasimha Purana | 3361 | 3361 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| niralamba | Niralamba Upanishad | 11 | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| nityakarmakriya | Nitya Karma Kriya | 16 | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| padmapuran | Padma Purana | 18 | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| prashna | Prashna Upanishad | 72 | 72 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ramayana | Valmiki Ramayana | 104 | 104 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ramcharitmanas | Shri Ramcharitmanas | 70 | 70 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ravanasamhita | Ravana Samhita | 44 | 44 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| rigveda | Rig Veda | 72 | 72 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| samaveda | Sama Veda | 30 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 28 | 28 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| shivasamhita | Shiva Samhita | 14 | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| shivaswarodaya | Shiva Swarodaya | 16 | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| shivpurana | Shiva Purana | 12977 | 12977 | 0 | 0 | 0 | 0 | 0 | 42 | 42 |
| shvetashvatara | Shvetashvatara Upanishad | 21 | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| skandapuran | Skanda Purana | 6468 | 6468 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| taittiriya | Taittiriya Upanishad | 44 | 44 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| tejobindu | Tejobindu Upanishad | 14 | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vamanpuran | Vamana Purana | 5558 | 5558 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| varahapuran | Varaha Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vayupuran | Vayu Purana | 7641 | 7641 | 0 | 0 | 0 | 0 | 0 | 10 | 10 |
| viduraniti | Vidura Niti | 299 | 299 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vinayapatrika | Vinaya Patrika | 13 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vishnupurana | Vishnu Purana | 5488 | 5488 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vivekchudamani | Vivekachudamani | 18 | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| yajurveda | Yajur Veda | 1809 | 1809 | 0 | 0 | 0 | 0 | 0 | 7 | 7 |
| yogarasayanam | Yoga Rasayanam | 11 | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| yogavasishtha | Yoga Vasishtha | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| yogavasistha | Yoga Vasistha | 14 | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Scriptures with commentary / word-meaning gaps

These are the scriptures that have verse records but are missing explanatory content. The biggest blockers are the large Puranas and Vedic texts.

| Scripture | Title | Loaded | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- |
| matsyapuran | Matsya Purana | 8330 | 392 | 392 |
| garudpurana | Garuda Purana | 11877 | 110 | 110 |
| agnipuran | Agni Purana | 11043 | 103 | 103 |
| markandeypuran | Markandeya Purana | 4333 | 90 | 90 |
| naradapuran | Narada Purana | 15198 | 64 | 64 |
| shivpurana | Shiva Purana | 12977 | 42 | 42 |
| atharvaveda | Atharva Veda | 5627 | 39 | 39 |
| vayupuran | Vayu Purana | 7641 | 10 | 10 |
| brahmandpuran | Brahmanda Purana | 13496 | 9 | 9 |
| lingapuran | Linga Purana | 6726 | 7 | 7 |
| yajurveda | Yajur Veda | 1809 | 7 | 7 |
| kurmapuran | Kurma Purana | 5572 | 6 | 6 |
| brahmapuran | Brahma Purana | 13443 | 1 | 1 |
| harivanshpuran | Harivamsha Purana | 5870 | 1 | 1 |

### Sample verse references with missing commentary

- **matsyapuran** (Matsya Purana): matsyapuran:7:39, matsyapuran:7:51, matsyapuran:9:2
- **garudpurana** (Garuda Purana): garudpurana:6:17, garudpurana:6:20, garudpurana:15:8
- **agnipuran** (Agni Purana): agnipuran:57:6, agnipuran:58:12, agnipuran:58:14
- **markandeypuran** (Markandeya Purana): markandeypuran:6:15, markandeypuran:6:16, markandeypuran:6:17
- **naradapuran** (Narada Purana): naradapuran:21:28, naradapuran:25:44, naradapuran:51:36
- **shivpurana** (Shiva Purana): shivpurana:7:5.2, shivpurana:7:5.21, shivpurana:7:8.14
- **atharvaveda** (Atharva Veda): atharvaveda:4:14.5, atharvaveda:6:112.1, atharvaveda:9:5.24
- **vayupuran** (Vayu Purana): vayupuran:33:16, vayupuran:85:34, vayupuran:92:20
- **brahmandpuran** (Brahmanda Purana): brahmandpuran:52:21, brahmandpuran:99:7, brahmandpuran:114:32
- **lingapuran** (Linga Purana): lingapuran:15:9, lingapuran:48:10, lingapuran:55:32
- **yajurveda** (Yajur Veda): yajurveda:8:14, yajurveda:8:16, yajurveda:12:1
- **kurmapuran** (Kurma Purana): kurmapuran:73:52, kurmapuran:88:110, kurmapuran:88:113
- **brahmapuran** (Brahma Purana): brahmapuran:79:16
- **harivanshpuran** (Harivamsha Purana): harivanshpuran:119:12

## Scriptures with critical text gaps

No critical gaps found — every loaded verse has `sanskrit` and `translation`.

## Scriptures with supporting-language gaps

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| durgasaptashati | Durga Saptashati | 634 | 634 | 0 | 0 | 0 | 0 | 624 | 0 | 0 |

## Duplicate verse references

No duplicate `chapter:verse` references found within any scripture.

---

_Generated by `scripts/verse-audit.js` on 2026-07-14._