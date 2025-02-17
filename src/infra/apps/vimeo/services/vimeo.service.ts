import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vimeo } from '@vimeo/vimeo';
import { UploadVideoDTO } from '../dtos/uploadVideo.dto';

@Injectable()
export class VimeoService {
  private readonly VimeoClient: Vimeo;

  constructor(private readonly configService: ConfigService) {
    // Initialize Vimeo API
    this.VimeoClient = new Vimeo(
      this.configService.get('vimeo.client_id'),
      this.configService.get('vimeo.client_secret'),
      this.configService.get('vimeo.access_token'),
    );
  }

  private async getUploadUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.VimeoClient.request(
        {
          method: 'GET',
          path: `/me/videos`,
        },
        (error, body, status_code, headers) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // @ts-expect-error - location is not defined in the type
            const uploadUrl = headers.location;
            resolve(uploadUrl);
          }
        },
      );
    });
  }

  private async uploadFile({
    filename,
    filepath,
    video,
    product_id,
    user_id,
    lesson_id,
    video_url,
  }: UploadVideoDTO): Promise<any> {
    return new Promise((resolve, reject) => {
      this.VimeoClient.upload(
        filepath,
        {
          uri: video_url,
          name: video.name,
          description: video.description,
          privacy: {
            view: 'disable', // disable video view
            download: false,
            embed: 'whitelist',
          },
          metadata: {
            product_id,
            lesson_id,
            user_id,
            filename,
          },
          embed_domains: ['members.sunize.com.br', 'localhost'],
          embed: {
            end_screen: {
              type: 'empty',
            },
            buttons: {
              embed: false,
              fullscreen: true,
              hd: true,
              like: false,
              scaling: true,
              share: false,
              watchlater: false,
            },
            color: '00adef',
            title: {
              owner: 'hide',
              name: 'hide',
              portrait: 'hide',
            },
            logos: {
              vimeo: false,
            },
          },
        },
        (uri) => {
          return resolve(uri);
        },
        (bytes_uploaded, bytes_total) =>
          console.log(`${bytes_uploaded} of ${bytes_total}`),
        (error) => reject(error),
      );
    });
  }

  async createVideo(data: UploadVideoDTO) {
    const uploadUrl = await this.getUploadUrl();
    const uploadResponse = await this.uploadFile({
      ...data,
      video_url: uploadUrl,
    });
    const videoUrl = `https://player.vimeo.com/video/${uploadResponse
      .split('/')
      .pop()}`;
    return videoUrl;
  }

  async getVideoUploadProgress(video_url: string) {
    return new Promise((resolve, reject) => {
      this.VimeoClient.request(
        {
          method: 'GET',
          path: `/videos/${video_url.split('/').pop()}?fields=transcode.status`,
        },
        (error, body) => {
          if (error) {
            reject(error);
          }

          resolve(body);
        },
      );
    });
  }

  async getUserVideos() {
    return this.VimeoClient.request(
      {
        method: 'GET',
        path: '/me/videos',
      },
      (error, body) => {
        if (error) {
          console.log(error);
          return;
        }

        console.log(body);
      },
    );
  }

  async getThumbnail(video_url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.VimeoClient.request(
        {
          method: 'GET',
          path: `/videos/${video_url.split('/').pop()}`,
        },
        (error, body) => {
          if (error) {
            reject(error);
          }

          resolve(body.pictures.sizes[2].link);
        },
      );
    });
  }

  async getVideoDuration(video_url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.VimeoClient.request(
        {
          method: 'GET',
          path: `/videos/${video_url.split('/').pop()}`,
        },
        (error, body) => {
          if (error) {
            reject(error);
          }

          resolve(body.duration); // in seconds
        },
      );
    });
  }

  async deleteVideo(video_url: string) {
    console.log('Deleting video', video_url.split('/').pop());
    return new Promise((resolve, reject) => {
      this.VimeoClient.request(
        {
          method: 'DELETE',
          path: '/videos/' + video_url.split('/').pop(),
        },
        (error, body) => {
          if (error) {
            reject(error);
          }

          resolve(body);
        },
      );
    });
  }

  // async getUserStorage() {}
}
