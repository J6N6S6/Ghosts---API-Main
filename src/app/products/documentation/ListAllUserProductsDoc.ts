import { Products } from '@/infra/database/entities/products.entity';

export const ListAllUserProductsDoc = {
  status: 200,
  name: 'ListAllProducts',
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
            schema: Products,
            type: 'array',
            items: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
