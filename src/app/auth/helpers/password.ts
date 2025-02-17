import * as bcrypt from 'bcryptjs';
import { GenerateRandomString } from './random';

export function hashPassword(password: string) {
  return bcrypt.hash(password, 8);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function generatePassword(passwordLength: number) {
  let password = GenerateRandomString(passwordLength);

  while (!validatePassword(password).isValid) {
    password = GenerateRandomString(passwordLength);
  }

  return password;
}

export function validatePassword(password: string) {
  if (password.length < 8 || password.length > 32)
    return {
      isValid: false,
      message: 'Informe uma senha com 8 a 32 caracteres',
    };

  return {
    isValid: /[a-z]/.test(password) && /[0-9]/.test(password),
    message: 'Sua senha deve conter letras e números',
  };
}
