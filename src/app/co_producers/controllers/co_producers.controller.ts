import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { UserIsProductOwner } from '@/shared/decorators/user-is-product-owner.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoProducersService } from '../services/co_producers.service';
import { CreateCoProducerBody } from '../validators/create_co_producer.body';
import { UpdateCoProducerBody } from '../validators/update_co_producer.body';

@Controller('products/:product_id/coproducers')
export class CoProducersController {
  constructor(private readonly coProducersService: CoProducersService) {}

  @Post('add')
  @UserIsProductOwner()
  async addCoProducer(
    @CurrentUser('user_id') user_id: string,
    @Body() data: CreateCoProducerBody,
    @Param('product_id') product_id: string,
  ) {
    const co_producer = await this.coProducersService.create({
      ...data,
      producer_id: user_id,
      product_id,
    });

    return {
      hasError: false,
      data: co_producer,
    };
  }

  @Post('update/:co_producer_id')
  @UserIsProductOwner()
  async updateCoProducer(
    @Body() data: UpdateCoProducerBody,
    @Param('product_id') product_id: string,
    @Param('co_producer_id') co_producer_id: string,
    @CurrentUser('user_id') producer_id: string,
  ) {
    await this.coProducersService.update({
      ...data,
      co_producer_id,
      product_id,
      producer_id,
    });

    return {
      hasError: false,
      message: 'Co-produtor atualizado com sucesso!',
    };
  }

  @Post('invite/:accept') // accept or refuse
  async acceptInvite(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
    @Param('accept') accept: string,
  ) {
    const accepted = accept === 'accept';

    await this.coProducersService.acceptInvite({
      user_id,
      product_id,
      accepted,
    });

    return {
      hasError: false,
      message: `Convite ${accepted ? 'aceito' : 'recusado'} com sucesso!`,
    };
  }

  @Get('list')
  async listCoProducers(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const co_producers = await this.coProducersService.listCoProducers(
      product_id,
      user_id,
    );

    return {
      hasError: false,
      data: co_producers,
    };
  }

  @Post('remove/:co_producer_id')
  @UserIsProductOwner()
  async removeCoProducer(
    @Param('co_producer_id') co_producer_id: string,
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') producer_id: string,
  ) {
    await this.coProducersService.removeCoProducer({
      co_producer_id,
      product_id,
      producer_id,
    });

    return {
      hasError: false,
      message: 'Co-produtor removido com sucesso!',
    };
  }
}
