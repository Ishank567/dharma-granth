const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, '../app/layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Add DarkModeToggle import
const darkModeImport = `import { DarkModeToggle } from "@/app/components/DarkModeToggle";`;

// Find the last import and add after it
layoutContent = layoutContent.replace(
  /(import.*from "@\/app\/components\/[^"]+";)/,
  `$1\n${darkModeImport}`
);

// Add the toggle to the header - find the header section
layoutContent = layoutContent.replace(
  /(<header[^>]*>)/,
  `$1\n        <div className="flex items-center">\n          <DarkModeToggle />\n        </div>`
);

fs.writeFileSync(layoutPath, layoutContent);
console.log('✓ DarkModeToggle integrated into layout.tsx');
