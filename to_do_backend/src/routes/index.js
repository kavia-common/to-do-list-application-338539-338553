const express = require('express');
const path = require('path');
const healthController = require('../controllers/health');
const { TasksRepository } = require('../repositories/tasksRepository');
const { TasksFlow } = require('../flows/tasksFlow');
const { Logger } = require('../utils/logger');
const { TasksController } = require('../controllers/tasks');
const { createTasksRouter } = require('./tasks');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// --- Tasks wiring (single canonical flow + repo) ---
const logger = new Logger();
const storageFilePath = path.join(__dirname, '../../data/tasks.json');
const repo = new TasksRepository({ storageFilePath });
const flow = new TasksFlow({ repo, logger });
const controller = new TasksController({ flow });

router.use('/tasks', createTasksRouter({ controller }));

module.exports = router;
