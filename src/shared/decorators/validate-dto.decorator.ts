import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidatorOptions, validate } from 'class-validator';

export function ValidateDTO(dtoClass: any): MethodDecorator {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const dtoInstance = plainToInstance(dtoClass, args[1]);
      const validatorOptions: ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
      };
      const errors = await validate(dtoInstance, validatorOptions);

      if (errors.length > 0) {
        const errorMessage = errors
          .map((error) => Object.values(error.constraints))
          .join(', ');
        throw new HttpException(errorMessage, 500);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
