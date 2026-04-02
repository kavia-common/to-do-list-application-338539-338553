const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do Backend API',
      version: '1.0.0',
      description: 'Express API for a To-Do app (tasks CRUD, completion, filtering).',
    },
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'completed', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', example: 'tsk_kx1x9q_abc12345' },
            title: { type: 'string', example: 'Buy groceries' },
            completed: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
