import { ClientException } from '@/infra/exception/client.exception';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { ProductsLinks, ProductsPixel } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  Content,
  CustomData,
  DeliveryCategory,
  EventRequest,
  FacebookAdsApi,
  ServerEvent,
  UserData,
} from 'facebook-nodejs-business-sdk';
import { IsNull, Not } from 'typeorm';
import { SendMetaMetricsDTO } from './send_meta_metrics.dto';

@Injectable()
export class SendMetaMetricsCase {
  constructor(
    private readonly productsLinksRepository: ProductsLinksRepository,
    private readonly productsPixelRepository: ProductsPixelRepository,
  ) {}

  async execute({
    data,
    short_id,
    test_event_code,
  }: SendMetaMetricsDTO): Promise<void> {
    const productData = await this.productsLinksRepository.findOne({
      where: {
        short_id,
      },
      select: {
        product_id: true,
        price: true,
      },
    });

    if (!productData) {
      throw new ClientException('Produto não encontrado');
    }

    const metaPixels = await this.productsPixelRepository.find({
      where: {
        product_id: productData.product_id,
        type: 'FACEBOOK',
        token: Not(IsNull()),
      },
    });

    for (const pixel of metaPixels) {
      try {
        await this.sendPixelEvent(pixel, productData, data, test_event_code);
      } catch (error) {
        console.error(`Erro ao enviar evento para o pixel ${pixel.id}:`, error);
      }
    }
  }

  private async sendPixelEvent(
    pixel: ProductsPixel,
    productData: ProductsLinks,
    eventData: SendMetaMetricsDTO['data'],
    test_event_code?: string,
  ) {
    FacebookAdsApi.init(pixel.token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const clientData = eventData.user_data;

    const hashedEmail = this.hashAndTransformEmail(clientData?.em);
    const hashedPhoneNumber = this.hashAndTransformPhoneNumber(clientData?.ph);
    const hashedFirstName = this.hashAndTransformName(clientData?.fn);
    const hashedLastName = this.hashAndTransformName(clientData?.ln);
    const hashedDateOfBirth = this.hashAndTransformDateOfBirth(clientData?.db);
    const hashedCity = this.hashAndTransformCity(clientData?.ct);
    const hashedState = this.hashAndTransformState(clientData?.st);
    const hashedPostalCode = this.hashAndTransformPostalCode(clientData?.zp);
    const hashedCountry = this.hashAndTransformCountry(clientData?.country);

    const userData = new UserData()
      .setEmails([hashedEmail])
      .setPhones([hashedPhoneNumber])
      .setFirstName(hashedFirstName)
      .setLastName(hashedLastName)
      .setCity(hashedCity)
      .setState(hashedState)
      .setZip(hashedPostalCode)
      .setCountry(hashedCountry)
      .setDateOfBirth(hashedDateOfBirth)
      .setClientIpAddress(clientData?.client_ip_address)
      .setClientUserAgent(clientData?.client_user_agent)
      .setFbp(clientData.fbp)
      .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const content = new Content()
      .setId(productData.product_id)
      .setQuantity(1)
      .setDeliveryCategory(DeliveryCategory.IN_STORE);

    const customData = new CustomData()
      .setContents([content])
      .setCurrency('BRL')
      .setValue(productData.price);

    const serverEvent = new ServerEvent()
      .setEventName(eventData.event_name)
      .setEventTime(currentTimestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(eventData.event_source_url)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(pixel.token, pixel.content)
      .setEvents(eventsData)
      .setTestEventCode(test_event_code);

    return eventRequest.execute();
  }

  private hashAndTransformEmail(email: string): string {
    // Remover espaços em branco e converter para minúsculas
    const formattedEmail = email?.trim().toLowerCase() || '';
    return this.hashString(formattedEmail);
  }

  private hashAndTransformPhoneNumber(phoneNumber: string): string {
    // Remover símbolos, letras e zeros à esquerda
    const formattedPhoneNumber =
      phoneNumber?.replace(/\D/g, '').replace(/^0+/, '') || '';
    return this.hashString(formattedPhoneNumber);
  }

  private hashAndTransformName(name: string): string {
    // Recomendamos o uso de caracteres de A a Z do alfabeto romano
    const formattedName = name?.replace(/[^a-zA-Z]/g, '') || '';
    return this.hashString(formattedName);
  }

  private hashAndTransformDateOfBirth(dateOfBirth: string): string {
    // Aceitamos o formato de datas AAAAMMDD
    const formattedDateOfBirth = dateOfBirth?.replace(/\D/g, '') || '';
    return this.hashString(formattedDateOfBirth);
  }

  private hashAndTransformCity(city: string): string {
    // Recomendamos o uso de caracteres de A a Z do alfabeto romano
    const formattedCity = city?.replace(/[^a-zA-Z]/g, '') || '';
    return this.hashString(formattedCity);
  }

  private hashAndTransformState(state: string): string {
    // Use o código de abreviação ANSI de dois caracteres em minúsculas
    const formattedState = state?.toLowerCase() || '';
    return this.hashString(formattedState);
  }

  private hashAndTransformPostalCode(postalCode: string): string {
    // Use letras minúsculas sem espaços ou traços. Use apenas os 5 primeiros dígitos dos códigos postais dos EUA.
    const formattedPostalCode =
      postalCode?.replace(/\s+/g, '').substring(0, 5) || '';
    return this.hashString(formattedPostalCode);
  }

  private hashAndTransformCountry(country: string): string {
    // Use os códigos de país com duas letras no padrão ISO 3166-1 alfa-2 em minúscula
    const formattedCountry = country?.toLowerCase() || '';
    return this.hashString(formattedCountry);
  }

  private hashString(input: string): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(input);
    return sha256.digest('hex');
  }
}
