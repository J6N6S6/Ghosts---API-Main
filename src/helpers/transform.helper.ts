import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import { PhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function toLowerCase(value: string): string {
  return value.toLowerCase();
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  if (value == undefined) return undefined;
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  if (value == undefined) return undefined;
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  if (value === undefined) return undefined;
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}

@ValidatorConstraint({ name: 'notEqual', async: false })
export class NotEqualValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must not be equal to ${relatedPropertyName}`;
  }
}

export function NotEqual(property: string, message: string = undefined) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: !message
          ? `${propertyName} must not be equal to ${property}`
          : message,
      },
      constraints: [property],
      validator: NotEqualValidator,
    });
  };
}

export function IsE164PhoneNumber(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isE164PhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const phoneNumber: PhoneNumber | null =
            parsePhoneNumberFromString(value);

          if (
            !(
              phoneNumber !== null &&
              phoneNumber.number === value &&
              phoneNumber.isValid()
            )
          )
            return false;

          return true;
        },
      },
    });
  };
}

export function IsBirthDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBirthDate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'A data de nascimento deve ser válida e estar no formato DD/MM/YYYY',
        ...validationOptions,
      },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          // Verifica se a string de data está no formato correto (DD/MM/YYYY)
          const regex = /^\d{2}\/\d{2}\/\d{4}$/;
          if (!regex.test(value)) {
            return false;
          }

          const date: Date = new Date(value);
          const now: Date = new Date();
          const minDate: Date = new Date(
            now.getFullYear() - 120,
            now.getMonth(),
          );

          if (date > now || date < minDate) return false;

          return true;
        },
      },
    });
  };
}
