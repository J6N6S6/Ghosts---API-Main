import { VimeoService } from '@/infra/apps/vimeo/services/vimeo.service';
import { ClientException } from '@/infra/exception/client.exception';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly vimeoService: VimeoService,
  ) {}

  getYoutubeVideoId(url: string): string {
    if (url.includes('youtu.be')) return url.split('/').pop();
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return videoId.substring(0, ampersandPosition);
    }
    return videoId;
  }

  getVimeoVideoId(url: string): string {
    return url.split('/').pop();
  }

  getVideoDetails(url: string): {
    platform: 'youtube' | 'vimeo';
    id: string;
  } {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return {
        platform: 'youtube' as 'youtube' | 'vimeo',
        id: this.getYoutubeVideoId(url),
      };
    }

    if (url.includes('vimeo.com') || url.includes('player.vimeo.com')) {
      return {
        platform: 'vimeo' as 'youtube' | 'vimeo',
        id: this.getVimeoVideoId(url),
      };
    }

    return null;
  }

  async getThumbnail(url: string): Promise<string> {
    const isPlatform = this.getVideoDetails(url);

    if (!isPlatform) return null;

    if (isPlatform.platform === 'youtube') {
      return await this.getYoutubeThumbnail(isPlatform.id);
    }

    return await this.vimeoService.getThumbnail(url);
  }

  convertYoutubeDurationToSeconds(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  async getVideoDuration(url: string): Promise<number> {
    const isPlatform = this.getVideoDetails(url);

    if (!isPlatform) return null;

    if (isPlatform.platform === 'vimeo')
      return this.vimeoService.getVideoDuration(url);

    const videoId = isPlatform.id;
    const apiKey = this.configService.get('google.API_KEY');

    const fetch = await this.httpService.axiosRef.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`,
    );
    if (!fetch.data.items.length)
      throw new ClientException('O vídeo informado não foi encontrado.');

    return this.convertYoutubeDurationToSeconds(
      fetch.data.items[0].contentDetails.duration,
    );
  }

  async getYoutubeThumbnail(id: string): Promise<string> {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
}
