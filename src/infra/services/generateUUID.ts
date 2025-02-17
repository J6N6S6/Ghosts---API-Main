import { v4 as uuid } from 'uuid';

export class GenerateUUID {
  static generate(): string {
    return uuid();
  }
}
