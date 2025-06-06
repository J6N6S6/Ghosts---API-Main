import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { S3Module } from 'nestjs-s3';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmDbModule } from './repositories/typeorm/module/typeorm.module';

import { FileUploadService } from './services/uploadFiles.service';

import {
  CategoriesRepository,
  CoProducersRepository,
  LessonCommentsLikesRepository,
  LessonCommentsRepository,
  LessonRatingsRepository,
  NotificationsRepository,
  NotificationsTokenRepository,
  PackagesRepository,
  PlataformSettingsRepository,
  ProductsAffiliatesRepository,
  ProductsLessonsRepository,
  ProductsLinksRepository,
  ProductsMaterialsRepository,
  ProductsModulesRepository,
  ProductsPixelRepository,
  ProductsPreferencesRepository,
  ProductsRepository,
  PurchasesRepository,
  RewardsRepository,
  SectionsRepository,
  TaxesRepository,
  TransactionsBuyersRepository,
  TransactionsRepository,
  UserActivityRepository,
  UserBankingAccountsRepository,
  UserBankingTransactionsRepository,
  UserNotificationsPreferencesRepository,
  UserOldPasswordsRepository,
  UserResetPasswordsRepository,
  UserRewardsRepository,
  UserSessionsRepository,
  UsersRepository,
  VouchersRepository,
  WithdrawalsRepository,
  WarnsRepository,
} from '@/domain/repositories';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import {
  Categories,
  CoProducers,
  LessonComments,
  LessonCommentsLikes,
  LessonRatings,
  NotificationToken,
  Notifications,
  Packages,
  PlataformSettings,
  Products,
  ProductsAffiliates,
  ProductsLessons,
  ProductsLinks,
  ProductsMaterials,
  ProductsModules,
  ProductsPixel,
  ProductsPreferences,
  Purchases,
  RefundRequestEntity,
  Rewards,
  Sections,
  Taxes,
  Transactions,
  TransactionsBuyers,
  UserBankingAccounts,
  UserBankingTransactions,
  UserOldPasswords,
  UserResetPasswords,
  UserRewards,
  UserSessions,
  Users,
  UsersActivity,
  UsersNotificationsPreferences,
  Vouchers,
  Withdrawals,
  UserSecureReserveTransactionsEntity,
  ProductsContentEntity,
  Warns,
} from '@/infra/database/entities';
import {
  TypeormCategoriesRepository,
  TypeormCoProducersRepository,
  TypeormLessonCommentsLikesRepository,
  TypeormLessonCommentsRepository,
  TypeormLessonRatingsRepository,
  TypeormNotificationsRepository,
  TypeormNotificationsTokenRepository,
  TypeormPackagesRepository,
  TypeormPlataformSettingsRepository,
  TypeormProductsAffiliatesRepository,
  TypeormProductsLessonsRepository,
  TypeormProductsLinksRepository,
  TypeormProductsMaterialsRepository,
  TypeormProductsModulesRepository,
  TypeormProductsPixelRepository,
  TypeormProductsPreferencesRepository,
  TypeormProductsRepository,
  TypeormPurchasesRepository,
  TypeormRefundRequestRepository,
  TypeormRewardsRepository,
  TypeormSectionsRepository,
  TypeormTaxesRepository,
  TypeormTransactionsBuyersRepository,
  TypeormTransactionsRepository,
  TypeormUserActivityRepository,
  TypeormUserBankingAccountsRepository,
  TypeormUserBankingTransactionsRepository,
  TypeormUserNotificationsPreferencesRepository,
  TypeormUserOldPasswordsRepository,
  TypeormUserResetPasswordsRepository,
  TypeormUserRewardsRepository,
  TypeormUserSessionsRepository,
  TypeormUsersRepository,
  TypeormVouchersRepository,
  TypeormWithdrawalsRepository,
  TypeormUserSecureReserveRepository,
  TypeormWarnRepository,
} from '@/infra/repositories/typeorm';
import { TwilioService } from './services/twilio.service';
import { VimeoModule } from './apps/vimeo/vimeo.module';
import { IESessionRepository } from '@/domain/repositories/session.reposity';
import { TypeormSessionRepository } from './repositories/typeorm/typerorm_session.repository';
import { SessionEntity } from './database/entities/session.entity';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { IEProductsContentRepository } from '@/domain/repositories/products_content.repository';
import { TypeormProductsContentRepository } from './repositories/typeorm/typeorm_products_content.repository';
import { TypeormUserInegrationsRepository } from './repositories/typeorm/typeorm_user_integrations.repository';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';
import { UserIntegrationsEntity } from './database/entities/user_integrations.entity';
//import { inject, use } from 'dd-trace';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
          },
          region: configService.get('AWS_REGION'),
          forcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
    VimeoModule,
    TypeOrmDbModule,

    TypeOrmModule.forFeature([
      Transactions,
      TransactionsBuyers,
      UserBankingAccounts,
      Products,
      CoProducers,
      Users,
      Vouchers,
      Purchases,
      Notifications,
      Categories,
      ProductsModules,
      Sections,
      Packages,
      NotificationToken,
      ProductsPreferences,
      ProductsPixel,
      ProductsLinks,
      UserBankingTransactions,
      Withdrawals,
      Taxes,
      Rewards,
      UserRewards,
      ProductsLessons,
      ProductsMaterials,
      UserSessions,
      UsersActivity,
      UserOldPasswords,
      UserResetPasswords,
      PlataformSettings,
      LessonRatings,
      LessonComments,
      LessonCommentsLikes,
      ProductsAffiliates,
      RefundRequestEntity,
      UsersNotificationsPreferences,
      SessionEntity,
      UserSecureReserveTransactionsEntity,
      ProductsContentEntity,
      UserIntegrationsEntity,
      Warns,
    ]),
  ],
  providers: [
    FileUploadService,
    TwilioService,
    {
      provide: TransactionsRepository,
      useClass: TypeormTransactionsRepository,
    },
    {
      provide: PlataformSettingsRepository,
      useClass: TypeormPlataformSettingsRepository,
    },
    {
      provide: TransactionsBuyersRepository,
      useClass: TypeormTransactionsBuyersRepository,
    },
    {
      provide: UserBankingAccountsRepository,
      useClass: TypeormUserBankingAccountsRepository,
    },
    {
      provide: ProductsRepository,
      useClass: TypeormProductsRepository,
    },
    {
      provide: CoProducersRepository,
      useClass: TypeormCoProducersRepository,
    },
    {
      provide: UsersRepository,
      useClass: TypeormUsersRepository,
    },
    {
      provide: VouchersRepository,
      useClass: TypeormVouchersRepository,
    },
    {
      provide: PurchasesRepository,
      useClass: TypeormPurchasesRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: TypeormNotificationsRepository,
    },
    {
      provide: NotificationsTokenRepository,
      useClass: TypeormNotificationsTokenRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: TypeormCategoriesRepository,
    },
    {
      provide: ProductsModulesRepository,
      useClass: TypeormProductsModulesRepository,
    },
    {
      provide: SectionsRepository,
      useClass: TypeormSectionsRepository,
    },
    {
      provide: PackagesRepository,
      useClass: TypeormPackagesRepository,
    },
    {
      provide: ProductsPixelRepository,
      useClass: TypeormProductsPixelRepository,
    },

    {
      provide: ProductsPreferencesRepository,
      useClass: TypeormProductsPreferencesRepository,
    },
    {
      provide: ProductsLinksRepository,
      useClass: TypeormProductsLinksRepository,
    },
    {
      provide: UserBankingTransactionsRepository,
      useClass: TypeormUserBankingTransactionsRepository,
    },
    {
      provide: WithdrawalsRepository,
      useClass: TypeormWithdrawalsRepository,
    },
    {
      provide: TaxesRepository,
      useClass: TypeormTaxesRepository,
    },
    {
      provide: RewardsRepository,
      useClass: TypeormRewardsRepository,
    },
    {
      provide: UserRewardsRepository,
      useClass: TypeormUserRewardsRepository,
    },
    {
      provide: ProductsLessonsRepository,
      useClass: TypeormProductsLessonsRepository,
    },
    {
      provide: ProductsMaterialsRepository,
      useClass: TypeormProductsMaterialsRepository,
    },
    {
      provide: UserSessionsRepository,
      useClass: TypeormUserSessionsRepository,
    },
    {
      provide: UserOldPasswordsRepository,
      useClass: TypeormUserOldPasswordsRepository,
    },
    {
      provide: UserResetPasswordsRepository,
      useClass: TypeormUserResetPasswordsRepository,
    },
    {
      provide: UserActivityRepository,
      useClass: TypeormUserActivityRepository,
    },
    {
      provide: LessonRatingsRepository,
      useClass: TypeormLessonRatingsRepository,
    },
    {
      provide: LessonCommentsRepository,
      useClass: TypeormLessonCommentsRepository,
    },
    {
      provide: LessonCommentsLikesRepository,
      useClass: TypeormLessonCommentsLikesRepository,
    },
    {
      provide: ProductsAffiliatesRepository,
      useClass: TypeormProductsAffiliatesRepository,
    },
    {
      provide: IERefundRequestRepository,
      useClass: TypeormRefundRequestRepository,
    },
    {
      provide: IESessionRepository,
      useClass: TypeormSessionRepository,
    },
    {
      provide: UserNotificationsPreferencesRepository,
      useClass: TypeormUserNotificationsPreferencesRepository,
    },
    {
      provide: IEUserSecureReserveRepository,
      useClass: TypeormUserSecureReserveRepository,
    },
    {
      provide: IEProductsContentRepository,
      useClass: TypeormProductsContentRepository,
    },
    {
      provide: UserIntegrationsRepository,
      useClass: TypeormUserInegrationsRepository,
    },
    {
      provide: WarnsRepository,
      useClass: TypeormWarnRepository,
    },
  ],
  exports: [
    JwtModule,
    VimeoModule,
    FileUploadService,
    TwilioService,
    TransactionsRepository,
    TransactionsBuyersRepository,
    UserBankingAccountsRepository,
    ProductsRepository,
    CoProducersRepository,
    UsersRepository,
    VouchersRepository,
    PurchasesRepository,
    NotificationsRepository,
    CategoriesRepository,
    ProductsModulesRepository,
    SectionsRepository,
    PackagesRepository,
    ProductsPixelRepository,
    NotificationsTokenRepository,
    ProductsPreferencesRepository,
    ProductsLinksRepository,
    UserBankingTransactionsRepository,
    WithdrawalsRepository,
    TaxesRepository,
    RewardsRepository,
    UserRewardsRepository,
    ProductsLessonsRepository,
    ProductsMaterialsRepository,
    UserSessionsRepository,
    UserOldPasswordsRepository,
    UserResetPasswordsRepository,
    UserActivityRepository,
    PlataformSettingsRepository,
    LessonRatingsRepository,
    LessonCommentsRepository,
    LessonCommentsLikesRepository,
    ProductsAffiliatesRepository,
    IERefundRequestRepository,
    UserNotificationsPreferencesRepository,
    IESessionRepository,
    IEUserSecureReserveRepository,
    IEProductsContentRepository,
    UserIntegrationsRepository,
    WarnsRepository,
  ],
})
export class InfraModule {}
