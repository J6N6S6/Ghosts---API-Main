import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { InjectS3 } from 'nestjs-s3';
import { Upload, Options } from '@aws-sdk/lib-storage';

interface IUploadFile {
  key?: string;
  filename?: string;
  buffer: Buffer;
  location?: string[];
  options?: Omit<Options['params'], 'Body' | 'Key' | 'Bucket'>;
}

@Injectable()
export class FileUploadService {
  constructor(
    private readonly configService: ConfigService,
    @InjectS3() private readonly s3: S3,
  ) {}

  async uploadFile({
    buffer,
    key,
    location = [],
    options,
  }: IUploadFile): Promise<{
    url: string;
    key: string;
  }> {
    const uploadService = new Upload({
      client: this.s3,
      params: {
        Bucket: this.configService.get('AWS_BUCKET'),
        Key:
          key ??
          `${
            location.length > 0 ? location.join('/') + '/' : ''
          }${new Date().getTime()}-${uuid()}`,
        Body: buffer,
        ACL: 'public-read',
        ContentType:
          'image/jpeg' ||
          'image/webp' ||
          'image/png' ||
          'application/pdf' ||
          'application/msword' ||
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          'application/vnd.ms-excel' ||
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          'application/vnd.ms-powerpoint' ||
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        CacheControl: 'max-age=31536000',
        ...options,
      },
    });

    const uploadResult: any = await uploadService.done();

    return {
      url: `${this.configService.get('CDN_URL')}${uploadResult.Key}`,
      key: uploadResult.Key,
    };
  }

  async deleteFile(url: string): Promise<void> {
    if (url.includes('sunize')) return;

    const key = url.replace(this.configService.get('CDN_URL'), '');

    await this.s3.deleteObject({
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: key,
    });
  }
}
