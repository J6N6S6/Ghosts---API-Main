import { Category } from '@/domain/models/categories.model';
import { CategoriesRepository } from '@/domain/repositories/categories.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class CategoriesSeed implements OnModuleInit {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async onModuleInit(): Promise<void> {
    const categories = await this.categoriesRepository.findAll();
    if (categories.length >= 1) return;

    const categoriesSeed = [
      {
        title: 'Saúde e Esportes',
        description: 'Saúde e Esportes',
      },
      {
        title: 'Finanças e Contabilidade',
        description: 'Finanças e Contabilidade',
      },
      {
        title: 'Relacionamentos',
        description: 'Relacionamentos',
      },
      {
        title: 'Negócios e Carreira',
        description: 'Negócios e Carreira',
      },
      {
        title: 'Espiritualidade e Religião',
        description: 'Espiritualidade e Religião',
      },
      {
        title: 'Sexualidade',
        description: 'Sexualidade',
      },
      {
        title: 'Entretenimento',
        description: 'Entretenimento',
      },
      {
        title: 'Culinária e Gastronomia',
        description: 'Culinária e Gastronomia',
      },
      {
        title: 'Idiomas',
        description: 'Idiomas',
      },
      {
        title: 'Direito',
        description: 'Direito',
      },
      {
        title: 'Apps & Software',
        description: 'Apps & Software',
      },
      {
        title: 'Programação',
        description: 'Programação',
      },
      {
        title: 'Literatura',
        description: 'Literatura',
      },
      {
        title: 'Casa e Construção',
        description: 'Casa e Construção',
      },
      {
        title: 'Desenvolvimento Pessoal',
        description: 'Desenvolvimento Pessoal',
      },
      {
        title: 'Produtividade',
        description: 'Produtividade',
      },
      {
        title: 'Liderança',
        description: 'Liderança',
      },
      {
        title: 'Marketing',
        description: 'Marketing',
      },
      {
        title: 'Moda e Beleza',
        description: 'Moda e Beleza',
      },
      {
        title: 'Animais e Plantas',
        description: 'Animais e Plantas',
      },
      {
        title: 'Educacional',
        description: 'Educacional',
      },
      {
        title: 'Hobbies',
        description: 'Hobbies',
      },
      {
        title: 'Design',
        description: 'Design',
      },
      {
        title: 'Internet',
        description: 'Internet',
      },
      {
        title: 'Ecologia e Meio Ambiente',
        description: 'Ecologia e Meio Ambiente',
      },
      {
        title: 'Música e Artes',
        description: 'Música e Artes',
      },
      {
        title: 'Tecnologia da Informação',
        description: 'Tecnologia da Informação',
      },
      {
        title: 'Outros',
        description: 'Outros',
      },
      {
        title: 'Empreendedorismo Digital',
        description: 'Empreendedorismo Digital',
      },
    ];

    const categoriesModel = categoriesSeed.map((category) => {
      return new Category(category);
    });

    await this.categoriesRepository.createMany(categoriesModel);
  }
}
