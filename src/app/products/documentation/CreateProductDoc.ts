export const CreateProductApiDoc = {
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
            type: 'Products',
          },
        },
      },
    },
  },
};
