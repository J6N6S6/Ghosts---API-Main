import { ProductsRepository, PurchasesRepository } from '@/domain/repositories';
import { Purchases } from '@/infra/database/entities';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import {
  ProductLessons,
  ProductModules,
} from '../../types/product_modules.type';
import { GetProductModulesCase } from '../get-product-modules/get_product_modules.case';
import { GetProductDTO } from './get_product.dto';

@Injectable()
export class GetProductCase {
  constructor(
    private readonly purchaseRepository: PurchasesRepository,
    private readonly getProductModulesCase: GetProductModulesCase,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({ user_id, product_id }: GetProductDTO) {
    const purchase = await this.purchaseRepository.findBy({
      where: [
        { user_id, product_id },
        {
          user_id,
          product: {
            short_id: product_id,
          },
        },
      ],
      select: {
        id: true,
        product: {
          id: true,
          short_id: true,
          title: true,
          image: true,
          support_email: true,
          support_phone: true,
          description: true,
          producer_name: true,
          category: {
            id: true,
            title: true,
          },
        },
        watched_lessons: true,
      },
      relations: ['product', 'product.category'],
    });

    if (!purchase) {
      throw new ClientException('você não tem acesso a este produto.');
    }

    const produtIsOwner = await this.productsRepository.findOne({
      where: [
        {
          id: purchase.product_id,
          owner_id: user_id,
        },
        {
          short_id: purchase.product_id,
          coproducers: {
            user_id,
          },
        },
      ],
      select: {
        id: true,
        owner_id: true,
      },
    });

    const user_type = produtIsOwner
      ? produtIsOwner.owner_id === user_id
        ? 'PRODUCER'
        : 'COPRODUCER'
      : 'USER';

    const { product } = purchase;

    const productModules = await this.getProductModulesCase.execute({
      user_id,
      product_id,
      lessons: true,
    });

    const [product_progress, product_duration] = productModules.reduce(
      (acc, m, i) => {
        const newAcc = [acc[0] + m.progress, acc[1] + m.duration];

        if (i === productModules.length - 1) {
          newAcc[0] = newAcc[0] / productModules.length;
        }

        return newAcc;
      },
      [0, 0],
    );

    const { currentLesson, lastLesson, nextLesson } = this.findLessons({
      productModules,
      watched_lessons: purchase.watched_lessons,
    });

    return {
      ...product,
      duration: product_duration,
      progress: parseFloat(product_progress.toFixed(2)),
      last_lesson: lastLesson,
      current_lesson: currentLesson,
      next_lesson: nextLesson,
      user_type,
    };
  }

  findLessons({
    productModules,
    watched_lessons,
  }: {
    productModules: ProductModules[];
    watched_lessons: Purchases['watched_lessons'];
  }) {
    let lastLesson: ProductLessons | undefined;
    let currentLesson: ProductLessons | null = null;
    let currentLessonModule: ProductModules | null = null;
    let nextLesson: ProductLessons | null = null;
    let nextLessonModule: ProductModules | null = null;
    let lastLessonModule: ProductModules | null = null;

    // Tentativa de encontrar a aula atual (baseada no último índice de watched_lessons)
    const lastWatchedLessonIndex = watched_lessons.length - 1;
    if (lastWatchedLessonIndex >= 0) {
      const lastWatchedLesson = watched_lessons[lastWatchedLessonIndex];
      const lastWatchedLessonModule = productModules.find((module) =>
        module.lessons.some(
          (lesson) => lesson.id === lastWatchedLesson.lesson_id,
        ),
      );

      if (lastWatchedLessonModule) {
        const localCurrentLessonModule = lastWatchedLessonModule;
        const LocalCurrentLesson = lastWatchedLessonModule.lessons.find(
          (lesson) => lesson.id === lastWatchedLesson.lesson_id,
        );

        // caso a aula atual ja tenha sido assistida, procura a próxima aula
        if (LocalCurrentLesson && lastWatchedLesson.lesson_completed) {
          const currentLessonIndex = localCurrentLessonModule.lessons.findIndex(
            (lesson) => lesson.id === LocalCurrentLesson.id,
          );
          if (
            currentLessonIndex <
            localCurrentLessonModule.lessons.length - 1
          ) {
            currentLessonModule = localCurrentLessonModule;
            currentLesson =
              localCurrentLessonModule.lessons[currentLessonIndex + 1];
          } else {
            // Procura pelos próximos módulos com aulas disponíveis
            let cr_nextModuleIndex = productModules.findIndex(
              (module) =>
                module.position === localCurrentLessonModule.position + 1,
            );
            if (cr_nextModuleIndex !== -1) {
              while (cr_nextModuleIndex < productModules.length) {
                const cr_nextModule = productModules[cr_nextModuleIndex];
                if (cr_nextModule.lessons.length > 0) {
                  currentLessonModule = cr_nextModule;
                  currentLesson = cr_nextModule.lessons[0];
                  break;
                }
                cr_nextModuleIndex++;
              }
            }
          }
        } else {
          currentLesson = LocalCurrentLesson;
          currentLessonModule = localCurrentLessonModule;
        }
      }
    }

    // Se a array watched_lessons estiver vazia, define a aula atual como a primeira aula do primeiro módulo com aulas disponíveis
    if (!currentLesson && productModules.length > 0) {
      for (const module of productModules) {
        if (module.lessons.length > 0) {
          currentLessonModule = module;
          currentLesson = module.lessons[0];
          break;
        }
      }
    }

    // --------
    // Lógica para encontrar a aula anterior
    if (currentLesson && currentLessonModule) {
      const currentLessonIndex = currentLessonModule.lessons.findIndex(
        (lesson) => lesson.id === currentLesson.id,
      );
      if (currentLessonIndex > 0) {
        lastLessonModule = currentLessonModule;
        lastLesson = currentLessonModule.lessons[currentLessonIndex - 1];
      } else {
        const prevModuleIndex = productModules.findIndex(
          (module) => module.position === currentLessonModule.position - 1,
        );
        if (prevModuleIndex !== -1) {
          const prevModule = productModules[prevModuleIndex];
          if (prevModule.lessons.length > 0) {
            lastLessonModule = prevModule;
            lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
          }
        }
      }
    }

    // --------
    // Lógica para encontrar a próxima aula
    if (currentLesson && currentLessonModule) {
      const currentLessonIndex = currentLessonModule.lessons.findIndex(
        (lesson) => lesson.id === currentLesson.id,
      );

      // Verifica se há uma próxima aula no mesmo módulo
      if (currentLessonIndex < currentLessonModule.lessons.length - 1) {
        nextLessonModule = currentLessonModule;
        nextLesson = currentLessonModule.lessons[currentLessonIndex + 1];
      } else {
        // Procura pelos próximos módulos com aulas disponíveis
        let nextModuleIndex = productModules.findIndex(
          (module) => module.position === currentLessonModule.position + 1,
        );
        if (nextModuleIndex !== -1) {
          while (nextModuleIndex < productModules.length) {
            const nextModule = productModules[nextModuleIndex];
            if (nextModule.lessons.length > 0) {
              nextLessonModule = nextModule;
              nextLesson = nextModule.lessons[0];
              break;
            }
            nextModuleIndex++;
          }
        }
      }
    }

    return {
      lastLesson: this.mapperLesson(lastLesson, lastLessonModule),
      currentLesson: this.mapperLesson(currentLesson, currentLessonModule),
      nextLesson: this.mapperLesson(nextLesson, nextLessonModule),
    };
  }

  mapperLesson(lesson?: ProductLessons, module?: ProductModules) {
    if (!lesson) return null;

    return {
      id: lesson.id,
      title: lesson.title,
      position: lesson.position,
      description: lesson.description,
      thumbnail: lesson.thumbnail,
      duration: lesson.duration,
      watched: false,
      watched_at: 0,
      module: module
        ? {
            id: module.id,
            title: module.title,
            position: module.position,
            image: module.image,
            show_title: module.show_title,
          }
        : null,
    };
  }
}
