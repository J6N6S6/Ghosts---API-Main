export const ListUserNotificationsApiDoc = {
  status: 200,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          hasError: {
            type: 'boolean',
            example: false,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '5f8f8b3b-3b8c-4b7a-8b0a-0b9b2b3b2b3b',
                },
                user_id: {
                  type: 'number',
                  example: 1,
                },
                message: {
                  type: 'string',
                  example: 'Mensagem de teste',
                },
                type: {
                  type: 'string',
                  example: 'CoProducerNotification',
                },
                data: {
                  type: 'object',
                  exemple: {
                    id: 1,
                    name: 'John Doe',
                    email: 'test@mail.com',
                  },
                },
                status: {
                  type: 'enum',
                  enum: ['READ', 'UNREAD'],
                  example: 'UNREAD',
                },
                deletable: {
                  type: 'boolean',
                  example: true,
                },
                deleteIn: {
                  type: 'Date',
                  example: '2021-01-01T00:00:00.000Z',
                },
                createdAt: {
                  type: 'Date',
                  example: '2021-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'Date',
                  example: '2021-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
    },
  },
};
