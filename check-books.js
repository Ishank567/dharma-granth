const db = require('better-sqlite3')('db/dharma.db');
console.log(db.prepare("SELECT title, slug FROM books WHERE slug LIKE '%veda%' OR slug LIKE '%ramayan%'").all());
