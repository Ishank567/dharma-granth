set -e
cd /c/Users/ishan/Music/dharma/dharma-granth
npx tsx scripts/apply-ai-translations.ts --write 2>&1 | grep -E "mahabharata|Applied"
node -e 'const fs=require("fs");const p="public/data/scriptures-full/mahabharata.json";fs.writeFileSync(p,JSON.stringify(JSON.parse(fs.readFileSync(p,"utf8"))))'
npm run check 2>&1 | grep -E "✓|✗|rror"
git add public/data/scriptures-full/mahabharata.json
git add -f scripts/cache/ai-translations/mahabharata-*.tsv
git commit -q -m "$1

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" 2>/dev/null
git log --oneline -1
npx tsx scripts/_coverage-report.ts | sed -n 2p
