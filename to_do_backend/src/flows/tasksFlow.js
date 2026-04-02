const {
  normalizeFilter,
  buildNewTask,
  validateCreateTaskRequest,
  validateUpdateTaskRequest,
  nowIso,
} = require('../domain/tasks');

/**
 * A reusable flow for task CRUD and filtering.
 *
 * Contract:
 * Inputs:
 * - repo: TasksRepository-like adapter (list/getById/create/update/delete)
 * - logger: { info, error } interface
 *
 * Outputs:
 * - Returns structured result objects:
 *   { ok: true, data } or { ok: false, status, error }
 *
 * Errors:
 * - Repository I/O errors are caught and returned as { ok:false, status:500 } with context logged.
 *
 * Side effects:
 * - Writes to repo persistence on mutations (handled by repository).
 */
class TasksFlow {
  constructor({ repo, logger }) {
    this._repo = repo;
    this._logger = logger;
  }

  _logInfo(op, extra) {
    this._logger.info({ op, ...extra });
  }

  _logError(op, err, extra) {
    this._logger.error({
      op,
      message: err.message,
      ...(err.cause ? { cause: err.cause.message } : {}),
      ...extra,
    });
  }

  list({ filter, q }) {
    const op = 'TasksFlow.list';
    try {
      const normalizedFilter = normalizeFilter(filter);
      const query = typeof q === 'string' ? q.trim().toLowerCase() : '';

      let tasks = this._repo.list();

      if (normalizedFilter === 'active') {
        tasks = tasks.filter(t => !t.completed);
      } else if (normalizedFilter === 'completed') {
        tasks = tasks.filter(t => t.completed);
      }

      if (query) {
        tasks = tasks.filter(t => (t.title || '').toLowerCase().includes(query));
      }

      this._logInfo(op, { filter: normalizedFilter, q: query, count: tasks.length });
      return { ok: true, data: { items: tasks } };
    } catch (err) {
      this._logError(op, err, { filter, q });
      return { ok: false, status: 500, error: 'Failed to list tasks.' };
    }
  }

  create({ body }) {
    const op = 'TasksFlow.create';
    const validation = validateCreateTaskRequest(body);
    if (!validation.ok) {
      return { ok: false, status: 400, error: validation.error };
    }

    try {
      const task = buildNewTask(body.title);
      const created = this._repo.create(task);
      this._logInfo(op, { id: created.id });
      return { ok: true, data: created };
    } catch (err) {
      this._logError(op, err, { title: body && body.title });
      return { ok: false, status: 500, error: 'Failed to create task.' };
    }
  }

  update({ id, body }) {
    const op = 'TasksFlow.update';
    const validation = validateUpdateTaskRequest(body);
    if (!validation.ok) {
      return { ok: false, status: 400, error: validation.error };
    }

    try {
      const patch = { updatedAt: nowIso() };
      if (Object.prototype.hasOwnProperty.call(body, 'title')) {
        patch.title = body.title.trim();
      }
      if (Object.prototype.hasOwnProperty.call(body, 'completed')) {
        patch.completed = body.completed;
      }

      const updated = this._repo.update(id, patch);
      if (!updated) {
        return { ok: false, status: 404, error: 'Task not found.' };
      }

      this._logInfo(op, { id });
      return { ok: true, data: updated };
    } catch (err) {
      this._logError(op, err, { id });
      return { ok: false, status: 500, error: 'Failed to update task.' };
    }
  }

  toggleComplete({ id }) {
    const op = 'TasksFlow.toggleComplete';
    try {
      const existing = this._repo.getById(id);
      if (!existing) {
        return { ok: false, status: 404, error: 'Task not found.' };
      }

      const updated = this._repo.update(id, {
        completed: !existing.completed,
        updatedAt: nowIso(),
      });

      this._logInfo(op, { id, completed: updated.completed });
      return { ok: true, data: updated };
    } catch (err) {
      this._logError(op, err, { id });
      return { ok: false, status: 500, error: 'Failed to toggle task completion.' };
    }
  }

  delete({ id }) {
    const op = 'TasksFlow.delete';
    try {
      const ok = this._repo.delete(id);
      if (!ok) {
        return { ok: false, status: 404, error: 'Task not found.' };
      }
      this._logInfo(op, { id });
      return { ok: true, data: { deleted: true } };
    } catch (err) {
      this._logError(op, err, { id });
      return { ok: false, status: 500, error: 'Failed to delete task.' };
    }
  }
}

module.exports = { TasksFlow };
