export const GetNotificationsSettingsApiDoc = {
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
              example_affiliate_request: {
                type: 'boolean',
                example: true,
              },
            },
          },
        },
      },
    },
  },
};
