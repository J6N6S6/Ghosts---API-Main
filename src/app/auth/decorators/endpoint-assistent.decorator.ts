import { SetMetadata } from '@nestjs/common';

export const IS_ASSISTENT_KEY = 'isAssistent';
export const IsAssistent = () => SetMetadata(IS_ASSISTENT_KEY, true);
