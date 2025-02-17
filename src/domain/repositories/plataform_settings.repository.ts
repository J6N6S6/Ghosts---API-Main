import { PlataformSettings } from '@/infra/database/entities';
import { FindOptionsWhere } from 'typeorm';
import { PlataformSetting } from '../models/plataform_settings.model';

export abstract class PlataformSettingsRepository {
  abstract create(data: PlataformSetting): Promise<PlataformSettings>;
  abstract update(data: PlataformSetting): Promise<void>;
  abstract findByKey(key: string): Promise<PlataformSettings>;

  abstract findById(id: number): Promise<PlataformSettings>;
  abstract findBy(
    where: FindOptionsWhere<PlataformSettings>,
  ): Promise<PlataformSettings>;
  abstract findAll(): Promise<PlataformSettings[]>;
}
