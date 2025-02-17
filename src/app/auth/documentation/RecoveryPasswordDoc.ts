export const RecoveryPasswordApiDoc = {
  status: 201,
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
            example: 'Email enviado com sucesso!',
          },
        },
      },
    },
  },
};
