import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsAdquirentValidForPaymentMethod(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAdquirentValidForPaymentMethod',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          const paymentMethod = object.payment_method;

          if (paymentMethod === 'PIX') {
            return ['FIREBANKING', 'MERCADO_PAGO', 'PAGGUEIO'].includes(value);
          }

          if (paymentMethod === 'CREDIT_CARD') {
            return value === 'celcoin';
          }

          return true; // No restriction for other payment methods
        },
        defaultMessage(args: ValidationArguments) {
          const object = args.object as any;
          const paymentMethod = object.payment_method;

          if (paymentMethod === 'PIX') {
            return 'adquirent must be one of the following: FIREBANKING, MERCADO_PAGO';
          }

          if (paymentMethod === 'CREDIT_CARD') {
            return 'adquirent must be celcoin';
          }

          return 'Invalid adquirent';
        },
      },
    });
  };
}
