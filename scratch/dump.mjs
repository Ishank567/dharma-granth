import fs from "node:fs";
const n=+process.argv[2]||150;
const s=JSON.parse(fs.readFileSync("public/data/scriptures-full/mahabharata.json","utf8"));
const done=new Set();
for(const f of fs.readdirSync("scripts/cache/ai-translations"))for(const l of fs.readFileSync("scripts/cache/ai-translations/"+f,"utf8").split(/\r?\n/)){const t=l.indexOf("\t");if(t>0&&l.startsWith("mahabharata:"))done.add(l.slice(0,t));}
let out=[];
for(const c of s.chapters)for(const v of c.verses){if(v.translation?.trim())continue;const r=`mahabharata:${c.number}:${v.number}`;if(done.has(r))continue;out.push(r+"\t"+v.sanskrit.replace(/\s+/g," "));if(out.length>=n)break;}
console.log(out.join("\n"));
