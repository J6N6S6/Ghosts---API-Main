import { Module } from '@nestjs/common';
import { VimeoService } from './services/vimeo.service';

@Module({
  imports: [],
  controllers: [],
  providers: [VimeoService],
  exports: [VimeoService],
})
export class VimeoModule {}
