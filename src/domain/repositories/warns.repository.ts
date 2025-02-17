import { Warn } from '@/domain/models/warns.model';
import { Warns } from '../../infra/database/entities';

export abstract class WarnsRepository {
  abstract create(data: Warn): Promise<Warns>;
  abstract delete(id: string): Promise<void>;
  abstract update(data: any): Promise<Warns>;
  abstract findById(id: string): Promise<Warns>;
  abstract findAll(): Promise<Warns[]>;
}
