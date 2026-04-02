class TasksController {
  /**
   * @param {object} params
   * @param {import('../flows/tasksFlow').TasksFlow} params.flow
   */
  constructor({ flow }) {
    this._flow = flow;
  }

  list(req, res) {
    const result = this._flow.list({ filter: req.query.filter, q: req.query.q });
    if (!result.ok) {
      return res.status(result.status).json({ status: 'error', message: result.error });
    }
    return res.status(200).json(result.data);
  }

  create(req, res) {
    const result = this._flow.create({ body: req.body });
    if (!result.ok) {
      return res.status(result.status).json({ status: 'error', message: result.error });
    }
    return res.status(201).json(result.data);
  }

  update(req, res) {
    const result = this._flow.update({ id: req.params.id, body: req.body });
    if (!result.ok) {
      return res.status(result.status).json({ status: 'error', message: result.error });
    }
    return res.status(200).json(result.data);
  }

  toggleComplete(req, res) {
    const result = this._flow.toggleComplete({ id: req.params.id });
    if (!result.ok) {
      return res.status(result.status).json({ status: 'error', message: result.error });
    }
    return res.status(200).json(result.data);
  }

  delete(req, res) {
    const result = this._flow.delete({ id: req.params.id });
    if (!result.ok) {
      return res.status(result.status).json({ status: 'error', message: result.error });
    }
    return res.status(200).json(result.data);
  }
}

module.exports = { TasksController };
