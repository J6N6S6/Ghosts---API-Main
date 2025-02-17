export const UpdateNotificationsSettingsApiDoc = {
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
            example: 'Configurações das notificações atualizadas!',
          },
        },
      },
    },
  },
};
