export const ReadNotificationApiDoc = {
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
          message: {
            type: 'string',
            example: 'Notificação marcada como lida',
          },
        },
      },
    },
  },
};
