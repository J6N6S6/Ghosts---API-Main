import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BankAccountsModule } from './banking/user_banking.module';
import { CategoriesModule } from './categories/categories.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CoProducersModule } from './co_producers/co_producers.module';
import { GatewaysModule } from './gateways/gateways.module';
import { IpnModule } from './ipn/ipn.module';
import { LessonsModule } from './lessons/lessons.module';
import { MailerModule } from './mailer/mailer.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { MembersModule } from './members/members.module';
import { MetricsModule } from './metrics/metrics.module';
import { ModulesModule } from './modules/modules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PackagesModule } from './packages/packages.module';
import { PixelsModule } from './pixels/pixels.module';
import { ProductsModule } from './products/products.module';
import { ProductsAffiliatesModule } from './products_affiliates/products_affiliates.module';
import { ProductsLinkModule } from './products_link/products_link.module';
import { PurchasesModule } from './purchases/purchases.module';
import { RefundRequestModule } from './refund_request/refund_request.module';
import { RewardsModule } from './rewards/rewards.module';
import { SectionsModule } from './sections/sections.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { SessionsModule } from './sessions/sessions.module';
import { AdminModule } from './admin/admin.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { WarnsModule } from './warns/warns.module';
import { DatadogMiddleware } from '@/infra/apps/datadog/midleware/datadog.middleware';

@Module({
  imports: [
    AuthModule,
    TransactionsModule,
    CheckoutModule,
    MetricsModule,
    BankAccountsModule,
    CoProducersModule,
    PurchasesModule,
    NotificationsModule,
    CategoriesModule,
    MailerModule,
    ProductsModule,
    ModulesModule,
    UsersModule,
    SectionsModule,
    PackagesModule,
    LessonsModule,
    PixelsModule,
    VouchersModule,
    ProductsLinkModule,
    RewardsModule,
    GatewaysModule,
    ProductsAffiliatesModule,
    MarketplaceModule,
    MembersModule,
    RefundRequestModule,
    SessionsModule,
    IpnModule,
    AdminModule,
    IntegrationsModule,
    WarnsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatadogMiddleware).forRoutes('*');
  }
}
