import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { Packages } from '@/infra/database/entities/packages.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Package } from '@/domain/models/packages.model';
@Injectable()
export class TypeormPackagesRepository implements PackagesRepository {
  constructor(
    @InjectRepository(Packages)
    private readonly PackagesRepository: Repository<Packages>,
  ) {}
  create(data: Packages): Promise<Packages> {
    return this.PackagesRepository.save({
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      owner_id: data.owner_id,
      contact: data.contact,
      logo: data.logo,
      banner: data.banner,
      favicon: data.favicon,
      color_header: data.color_header,
      background_color: data.background_color,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  findById(id: string): Promise<Packages> {
    return this.PackagesRepository.findOneBy({ id });
  }

  findBy(where: FindOptionsWhere<Packages>): Promise<Packages> {
    return this.PackagesRepository.findOneBy(where);
  }

  findByOwnerId(owner_id: string): Promise<Packages[]> {
    return this.PackagesRepository.findBy({ owner_id });
  }

  async update(data: Package): Promise<void> {
    const module = {
      id: data.id,
      title: data.title,
      description: data.description,
    };
    await this.PackagesRepository.update(
      {
        id: data.id,
      },
      module,
    );
  }

  async updateCustomization(data: Package): Promise<void> {
    const module = {
      id: data.id,
      contact: data.contact,
      background_color: data.background_color,
      color_header: data.color_header,
      favicon: data.favicon,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    await this.PackagesRepository.update(
      {
        id: data.id,
      },
      module,
    );
  }

  async updatePackImage(data: Package): Promise<void> {
    const pack = {
      id: data.id,
      image: data.image,
    };

    await this.PackagesRepository.update(
      {
        id: data.id,
      },
      pack,
    );
  }

  async updatePackBanner(data: Package): Promise<void> {
    const pack = {
      id: data.id,
      banner: data.banner,
    };

    await this.PackagesRepository.update(
      {
        id: data.id,
      },
      pack,
    );
  }

  async updatePackLogo(data: Package): Promise<void> {
    const pack = {
      id: data.id,
      logo: data.logo,
    };

    await this.PackagesRepository.update(
      {
        id: data.id,
      },
      pack,
    );
  }
}
