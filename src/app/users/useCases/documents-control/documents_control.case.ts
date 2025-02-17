import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { DocumentsControlDTO } from './documents_control.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class DocumentsControlCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    type = 'pending',
    items_per_page = 9,
    page = 1,
    search,
  }: DocumentsControlDTO): Promise<any> {
    if (type.toUpperCase() !== 'PENDING')
      throw new ClientException('So é possivel listar documentos pendentes');

    const status_index = type.toUpperCase() as
      | 'PENDING'
      | 'APPROVED'
      | 'REJECTED';

    let where: any = [
      {
        documentStatus: status_index,
      },
    ];
    if (search) {
      where = [
        {
          documentStatus: status_index,
          name: ILike(`%${search}%`),
        },
        {
          documentStatus: status_index,
          email: ILike(`%${search}%`),
        },
      ];
    }

    const [users, users_count, total] = await Promise.all([
      this.usersRepository.find({
        where,
        skip: (page - 1) * items_per_page,
        take: items_per_page,
        select: {
          id: true,
          name: true,
          email: true,
          documentStatus: true,
          documentReason: true,
          documents: true,
          document_approved_by: true,
          documentValidated: true,
          cpf: true,
          cnpj: true,
          rg: true,
          createdAt: true,
          admin_approved: {
            id: true,
            name: true,
            email: true,
          },
        },

        relations: ['admin_approved'],
      }),
      this.usersRepository.count({
        where,
      }),
      this.usersRepository.find({
        select: {
          documentStatus: true,
        },
      }),
    ]);

    return {
      users: users,
      page,
      total_pages: Math.ceil(users_count / items_per_page),
      total_items: total.length,

      total_documents_approved: total.filter(
        (user) => user.documentStatus === 'APPROVED',
      ).length,
      total_documents_pending: total.filter(
        (user) => user.documentStatus === 'PENDING',
      ).length,
      total_documents_rejected: total.filter(
        (user) => user.documentStatus === 'REJECTED',
      ).length,
    };
  }
}
