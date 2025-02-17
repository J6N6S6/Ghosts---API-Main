import { SetMetadata } from '@nestjs/common';

export const UserIsProductOwner = () => SetMetadata('userIsProductOwner', true);
