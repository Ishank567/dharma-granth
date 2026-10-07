import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage();
await p.addInitScript(()=>localStorage.setItem('dharma-theme','night'));
await p.goto('http://localhost:4173/scriptures/'); await p.waitForLoadState('networkidle');
console.log(await p.evaluate(()=>{const e=document.querySelector('[class*="min-w-[88px]"]');const c=getComputedStyle(e);return {cls:document.documentElement.className,theme:document.documentElement.dataset.theme,color:c.color,bg:c.backgroundColor,txt:e.textContent}}));
await b.close();
