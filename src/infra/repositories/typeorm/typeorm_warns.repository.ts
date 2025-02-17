import { Warn } from '@/domain/models/warns.model';
import { WarnsRepository } from '@/domain/repositories/warns.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warns } from '@/infra/database/entities/warns.entity';

@Injectable()
export class TypeormWarnRepository implements WarnsRepository {
  constructor(
    @InjectRepository(Warns)
    private readonly warnsRepository: Repository<Warns>,
  ) {}

  async create(data: Warn): Promise<any> {
    await this.warnsRepository.save({
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      created_by: data.created_by,
      created_at: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.warnsRepository.delete(id);
  }

  async findById(id: string): Promise<Warns> {
    const warn = await this.warnsRepository.findOne({
      where: {
        id,
      },
    });

    return warn;
  }

  async update(data: Warn): Promise<any> {
    const { id, ...updateData } = data;

    const output = await this.warnsRepository.update({ id }, { ...updateData });

    return output;
  }

  async findAll(): Promise<Warns[]> {
    const warns = await this.warnsRepository.find({
      relations: ['user'],
    });

    return warns;
  }
}
