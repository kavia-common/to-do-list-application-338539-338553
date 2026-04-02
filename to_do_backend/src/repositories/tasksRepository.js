const fs = require('fs');
const path = require('path');

/**
 * Task repository that persists tasks to a JSON file on disk.
 *
 * Contract:
 * - Stores tasks in memory for fast reads and writes.
 * - Persists every mutation to a JSON file (best-effort; throws on failure).
 * - Task shape:
 *   { id: string, title: string, completed: boolean, createdAt: string, updatedAt: string }
 *
 * Errors:
 * - Throws if persistence file cannot be read (malformed JSON) or written.
 *
 * Side effects:
 * - Reads from / writes to a JSON file in this container.
 */
class TasksRepository {
  /**
   * @param {object} params
   * @param {string} params.storageFilePath Absolute path to the JSON storage file
   */
  constructor({ storageFilePath }) {
    this._storageFilePath = storageFilePath;
    this._tasks = [];
    this._loaded = false;
  }

  _ensureLoaded() {
    if (this._loaded) {
      return;
    }

    try {
      if (!fs.existsSync(this._storageFilePath)) {
        fs.mkdirSync(path.dirname(this._storageFilePath), { recursive: true });
        fs.writeFileSync(this._storageFilePath, JSON.stringify([], null, 2));
      }

      const raw = fs.readFileSync(this._storageFilePath, 'utf-8');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new Error('Storage file content is not an array.');
      }

      this._tasks = parsed;
      this._loaded = true;
    } catch (err) {
      const wrapped = new Error(
        `TasksRepository failed to load storage file: ${err.message}`
      );
      wrapped.cause = err;
      throw wrapped;
    }
  }

  _persist() {
    try {
      fs.writeFileSync(this._storageFilePath, JSON.stringify(this._tasks, null, 2));
    } catch (err) {
      const wrapped = new Error(
        `TasksRepository failed to persist storage file: ${err.message}`
      );
      wrapped.cause = err;
      throw wrapped;
    }
  }

  list() {
    this._ensureLoaded();
    return [...this._tasks];
  }

  getById(id) {
    this._ensureLoaded();
    return this._tasks.find(t => t.id === id) || null;
  }

  create(task) {
    this._ensureLoaded();
    this._tasks.unshift(task);
    this._persist();
    return task;
  }

  update(id, patch) {
    this._ensureLoaded();
    const idx = this._tasks.findIndex(t => t.id === id);
    if (idx === -1) {
      return null;
    }
    const updated = { ...this._tasks[idx], ...patch };
    this._tasks[idx] = updated;
    this._persist();
    return updated;
  }

  delete(id) {
    this._ensureLoaded();
    const before = this._tasks.length;
    this._tasks = this._tasks.filter(t => t.id !== id);
    if (this._tasks.length === before) {
      return false;
    }
    this._persist();
    return true;
  }

  clearAll() {
    this._ensureLoaded();
    this._tasks = [];
    this._persist();
  }
}

module.exports = { TasksRepository };
