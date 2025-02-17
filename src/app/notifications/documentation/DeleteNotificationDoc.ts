export const DeleteNotificationApiDoc = {
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
            example: 'Notificação removida com sucesso!',
          },
        },
      },
    },
  },
};
