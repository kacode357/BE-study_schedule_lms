const swaggerJsdoc = require('swagger-jsdoc');

const isProd = process.env.NODE_ENV === 'production';

const servers = isProd
  ? [
    {
      url: 'https://study-schedule-lms.quangde.cloud/api',
      description: 'Production server',
    },
  ]
  : [
    {
      url: process.env.API_URL || 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'https://study-schedule-lms.quangde.cloud/api',
      description: 'Production server',
    },
  ];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study Schedule LMS API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống quản lý lịch học LMS',
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Quét tất cả file routes để lấy JSDoc comments
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
