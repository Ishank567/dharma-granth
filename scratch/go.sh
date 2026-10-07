cd /c/Users/ishan/Music/dharma/dharma-granth
f=scripts/cache/ai-translations/mahabharata-$1.tsv
cut -f1 scratch/batch.txt | tr -d '\r' | sort > /tmp/a.txt
cut -f1 $f | tr -d '\r' | sort > /tmp/b.txt
if [ -n "$(comm -3 /tmp/a.txt /tmp/b.txt)" ]; then echo "MISMATCH:"; comm -3 /tmp/a.txt /tmp/b.txt; exit 1; fi
bash scratch/finish.sh "$2" 2>&1 | grep -E "Applied|✗|rror|^[0-9a-f]{7} | [0-9]+%"
node -e 'const s=require("fs").readFileSync("public/data/scriptures-full/mahabharata.json","utf8");console.log("bad",(s.match(/[­Ѐ-ӿ]/g)||[]).length)'
if [ -n "$3" ]; then timeout 100 git push 2>&1 | grep -v "^remote: warning" | tail -1; fi
