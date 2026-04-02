const express = require('express');

/**
 * Creates the tasks router.
 * @param {object} params
 * @param {import('../controllers/tasks').TasksController} params.controller
 */
function createTasksRouter({ controller }) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   - name: Tasks
   *     description: CRUD operations for to-do tasks
   */

  /**
   * @swagger
   * /tasks:
   *   get:
   *     tags: [Tasks]
   *     summary: List tasks (with filtering and search)
   *     description: Returns tasks with optional filter (all/active/completed) and full-text search query.
   *     parameters:
   *       - in: query
   *         name: filter
   *         schema:
   *           type: string
   *           enum: [all, active, completed]
   *           default: all
   *         description: Filter tasks by completion status.
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         description: Case-insensitive substring match on the task title.
   *     responses:
   *       200:
   *         description: A list of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   */
  router.get('/', controller.list.bind(controller));

  /**
   * @swagger
   * /tasks:
   *   post:
   *     tags: [Tasks]
   *     summary: Create a new task
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title]
   *             properties:
   *               title:
   *                 type: string
   *                 example: Buy groceries
   *     responses:
   *       201:
   *         description: The created task
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation error
   */
  router.post('/', controller.create.bind(controller));

  /**
   * @swagger
   * /tasks/{id}:
   *   put:
   *     tags: [Tasks]
   *     summary: Update a task (title and/or completed)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               completed:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: The updated task
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.put('/:id', controller.update.bind(controller));

  /**
   * @swagger
   * /tasks/{id}/toggle:
   *   patch:
   *     tags: [Tasks]
   *     summary: Toggle task completion
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: The updated task
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.patch('/:id/toggle', controller.toggleComplete.bind(controller));

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     tags: [Tasks]
   *     summary: Delete a task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Deletion result
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 deleted:
   *                   type: boolean
   *                   example: true
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', controller.delete.bind(controller));

  return router;
}

module.exports = { createTasksRouter };
