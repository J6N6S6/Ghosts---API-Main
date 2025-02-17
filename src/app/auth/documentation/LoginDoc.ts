export const LoginApiDoc = {
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
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
              },
              user: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '1',
                  },
                  name: {
                    type: 'string',
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    example: 'costumer@sunize.com.br',
                  },
                  phone: {
                    type: 'string',
                    example: '551191234-5678',
                  },
                  identity: {
                    type: 'string',
                    example: '12345678901',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
