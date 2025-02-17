import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { CategoriesSeed } from './seeds/categories.seed';
import { TaxesSeed } from './seeds/taxes.seed';
import { RewardsSeed } from './seeds/rewards.seed';
import { PlataformSettingsSeed } from './seeds/plataform_settings.seed';

@Module({
  imports: [InfraModule],
  providers: [CategoriesSeed, TaxesSeed, RewardsSeed, PlataformSettingsSeed],
})
export class SeedModule {}
