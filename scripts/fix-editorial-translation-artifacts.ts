/** Replace nine OCR footnotes that were published in translation fields. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { FullScripture } from "./lib/scripture-schema";

const FIXES: Record<string, string> = {
  "lingapuran:33:4":
    "O brahmins, the masculine principle is Purusha, born from my body. From these two alone proceeds my creation, O brahmins; of this there is no doubt.",
  "lingapuran:106:5":
    "Afflicted by him, all those gods, O brahmins, went to Brahma. After informing him of everything, they approached the consort of Uma together with him.",
  "mahabharata:11:11.20":
    "The wise charioteer, the son of Gavalgana, then restrained him. Saying, 'Do not act so,' he spoke as if to calm and console him.",
  "mahabharata:11:14.11":
    "Dear one, his killing was not such as you praise. Yet my son did commit all those deeds of which you now speak to me.",
  "markandeypuran:58:2":
    "Earlier, in the account of Bharata, you described the blessed Hari as a tortoise. I now wish to hear fully about the form and extent of that tortoise.",
  "markandeypuran:58:4":
    "Markandeya said: Facing east, the blessed Lord abides in the form of a tortoise, covering this ninefold region of Bharata, O twice-born one.",
  "markandeypuran:90:1":
    "Thus ends Chapter 92, called 'The Goddess's Speech,' in the Devi Mahatmya within the Savarnika Manvantara of the Markandeya Purana. Chapter 93. The sage said: O king, I have related to you the supreme glory of the Goddess. Such is her power; by her this universe is sustained.",
  "matsyapuran:122:5":
    "In Shakadvipa and the other continents, each of the three divisions has seven mountain ranges. Straight and far-extending, they are set toward every direction and mark the boundaries of the regions.",
  "matsyapuran:127:27":
    "In heaven, the foremost gods move around Dhruva, who stands fixed like a central pivot. For the lines of Agnidhra and Kashyapa, he is the supreme Dhruva, the highest unmoving pole.",
};

const root = resolve(__dirname, "..");
const byScripture = new Map<string, Array<[string, string]>>();
for (const [ref, translation] of Object.entries(FIXES)) {
  const scriptureId = ref.split(":", 1)[0];
  const bucket = byScripture.get(scriptureId) ?? [];
  bucket.push([ref, translation]);
  byScripture.set(scriptureId, bucket);
}

let updated = 0;
for (const [scriptureId, fixes] of byScripture) {
  const path = resolve(root, `public/data/scriptures-full/${scriptureId}.json`);
  const scripture = JSON.parse(readFileSync(path, "utf8")) as FullScripture;

  for (const [ref, translation] of fixes) {
    const [, chapterNumber, ...verseParts] = ref.split(":");
    const verseNumber = verseParts.join(":");
    const chapter = scripture.chapters.find((item) => item.number === Number(chapterNumber));
    const verse = chapter?.verses.find((item) => String(item.number) === verseNumber);
    if (!verse) throw new Error(`Could not find ${ref}`);
    verse.translation = translation;
    updated++;
  }

  writeFileSync(path, `${JSON.stringify(scripture, null, 2)}\n`, "utf8");
}

console.log(`Replaced ${updated} editorial translation artifacts.`);
