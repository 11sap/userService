import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'API для управления пользователями с аутентификацией JWT',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Введите JWT токен. Пример: zDGsdgsdgFDSfCXZvpEQlfwkfxpFDF...'
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Уникальный идентификатор пользователя'
                        },
                        fullName: {
                            type: 'string',
                            description: 'Полное имя пользователя'
                        },
                        dateOfBirth: {
                            type: 'string',
                            format: 'date',
                            description: 'Дата рождения'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email пользователя'
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'user'],
                            description: 'Роль пользователя'
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive'],
                            description: 'Статус пользователя'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Дата создания'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Дата обновления'
                        }
                    }
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['fullName', 'dateOfBirth', 'email', 'password'],
                    properties: {
                        fullName: {
                            type: 'string',
                            example: 'Иван Иванов'
                        },
                        dateOfBirth: {
                            type: 'string',
                            format: 'date',
                            example: '1990-01-01'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'securePassword123'
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'user'],
                            example: 'user'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'securePassword123'
                        }
                    }
                },
                StatusUpdateRequest: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive'],
                            example: 'inactive'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        user: {
                            $ref: '#/components/schemas/User'
                        },
                        token: {
                            type: 'string',
                            description: 'JWT токен для авторизации'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Сообщение об ошибке'
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, {
        customSiteTitle: 'User Service API Documentation',
        customCss: `
          .swagger-ui input[type="text"] {
            min-width: 500px !important;
            font-family: monospace;
            font-size: 14px;
          }`
    }));
};