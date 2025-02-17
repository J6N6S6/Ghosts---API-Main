import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

class UpdateModulePositionBody {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  position: number;
}

export class UpdateAllModulesPositionBody {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateModulePositionBody)
  items: UpdateModulePositionBody[];
}
