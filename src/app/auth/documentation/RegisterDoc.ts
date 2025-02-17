export const RegisterApiDoc = {
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
            example: 'Usuário criado com sucesso!',
          },
        },
      },
    },
  },
};
