const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "tasks.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      due_date TEXT,
      priority TEXT DEFAULT 'medium'
    )
  `);

  db.all("PRAGMA table_info(tasks)", (err, columns) => {
    if (err) return;
    const hasDueDate = columns.some((col) => col.name === "due_date");
    if (!hasDueDate) {
      db.run("ALTER TABLE tasks ADD COLUMN due_date TEXT");
    }
    const hasPriority = columns.some((col) => col.name === "priority");
    if (!hasPriority) {
      db.run("ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'");
    }
  });
});

module.exports = db;
