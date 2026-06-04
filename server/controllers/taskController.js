const db = require("../db");

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const formatTask = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  completed: Boolean(row.completed),
  due_date: row.due_date || null,
  priority: row.priority || "medium",
  created_at: row.created_at,
  updated_at: row.updated_at,
});

exports.getAllTasks = async (req, res) => {
  try {
    const rows = await all("SELECT * FROM tasks ORDER BY id DESC");
    res.json(rows.map(formatTask));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description = "", completed = false, due_date = null, priority = "medium" } =
    req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const validPriorities = ["low", "medium", "high"];
  const sanitizedPriority = validPriorities.includes(String(priority).toLowerCase())
    ? String(priority).toLowerCase()
    : "medium";

  try {
    const result = await run(
      `INSERT INTO tasks (title, description, completed, due_date, priority)
       VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), description, completed ? 1 : 0, due_date || null, sanitizedPriority]
    );
    const row = await get("SELECT * FROM tasks WHERE id = ?", [result.lastID]);
    res.status(201).json(formatTask(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, due_date, priority } = req.body;

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  try {
    const existing = await get("SELECT * FROM tasks WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTitle =
      title !== undefined ? title.trim() : existing.title;
    const updatedDescription =
      description !== undefined ? description : existing.description;
    const updatedCompleted =
      completed !== undefined ? (completed ? 1 : 0) : existing.completed;
    const updatedDueDate =
      due_date !== undefined ? due_date || null : existing.due_date;

    let updatedPriority = existing.priority || "medium";
    if (priority !== undefined) {
      const validPriorities = ["low", "medium", "high"];
      updatedPriority = validPriorities.includes(String(priority).toLowerCase())
        ? String(priority).toLowerCase()
        : existing.priority;
    }

    await run(
      `UPDATE tasks
       SET title = ?, description = ?, completed = ?, due_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        updatedTitle,
        updatedDescription,
        updatedCompleted,
        updatedDueDate,
        updatedPriority,
        id,
      ]
    );

    const row = await get("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(formatTask(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleTask = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await get("SELECT * FROM tasks WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    const newCompleted = existing.completed ? 0 : 1;

    await run(
      `UPDATE tasks
       SET completed = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newCompleted, id]
    );

    const row = await get("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(formatTask(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await run("DELETE FROM tasks WHERE id = ?", [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
