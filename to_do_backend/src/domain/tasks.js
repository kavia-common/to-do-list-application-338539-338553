/**
 * Domain helpers for task validation and transformations.
 */

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  // No external dependency: stable-enough ID for MVP.
  return `tsk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Validates a filter string.
 * @param {string|undefined} filter
 * @returns {'all'|'active'|'completed'}
 */
function normalizeFilter(filter) {
  const v = (filter || 'all').toLowerCase();
  if (v === 'all' || v === 'active' || v === 'completed') {
    return v;
  }
  return 'all';
}

/**
 * Creates a normalized task object.
 * @param {string} title
 */
function buildNewTask(title) {
  const trimmed = title.trim();
  return {
    id: createId(),
    title: trimmed,
    completed: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function validateCreateTaskRequest(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object.' };
  }
  if (!isNonEmptyString(body.title)) {
    return { ok: false, error: 'title is required and must be a non-empty string.' };
  }
  return { ok: true };
}

function validateUpdateTaskRequest(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object.' };
  }

  const allowedKeys = ['title', 'completed'];
  const keys = Object.keys(body);
  const hasAny = keys.some(k => allowedKeys.includes(k));
  if (!hasAny) {
    return {
      ok: false,
      error: 'At least one of "title" or "completed" must be provided.',
    };
  }

  if (Object.prototype.hasOwnProperty.call(body, 'title') && body.title !== undefined) {
    if (!isNonEmptyString(body.title)) {
      return { ok: false, error: 'title must be a non-empty string when provided.' };
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'completed') && body.completed !== undefined) {
    if (typeof body.completed !== 'boolean') {
      return { ok: false, error: 'completed must be a boolean when provided.' };
    }
  }

  return { ok: true };
}

module.exports = {
  normalizeFilter,
  buildNewTask,
  validateCreateTaskRequest,
  validateUpdateTaskRequest,
  nowIso,
};
