const db = require('better-sqlite3')('db/dharma.db');
console.log(db.prepare("SELECT slug FROM books WHERE slug LIKE '%gita%' OR title LIKE '%gita%'").all());
