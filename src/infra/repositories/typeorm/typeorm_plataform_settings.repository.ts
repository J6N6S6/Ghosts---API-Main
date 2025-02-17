import { PlataformSetting } from '@/domain/models/plataform_settings.model';
import { PlataformSettingsRepository } from '@/domain/repositories';
import { PlataformSettings } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TypeormPlataformSettingsRepository
  implements PlataformSettingsRepository
{
  constructor(
    @InjectRepository(PlataformSettings)
    private readonly plataformSettingsRepository: Repository<PlataformSettings>,
  ) {}

  findById(id: number): Promise<PlataformSettings> {
    return this.plataformSettingsRepository.findOne({ where: { id } });
  }

  findByKey(key: string): Promise<PlataformSettings> {
    return this.plataformSettingsRepository.findOne({ where: { key } });
  }

  create(data: PlataformSetting): Promise<PlataformSettings> {
    return this.plataformSettingsRepository.save(data.allProps);
  }

  findBy(
    where: FindOptionsWhere<PlataformSettings>,
  ): Promise<PlataformSettings> {
    return this.plataformSettingsRepository.findOneBy(where);
  }

  async update(data: PlataformSetting): Promise<void> {
    await this.plataformSettingsRepository.update(data.id, data.allProps);
  }

  findAll(): Promise<PlataformSettings[]> {
    return this.plataformSettingsRepository.find();
  }
}
