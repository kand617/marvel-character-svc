import { Module } from '@nestjs/common'
import { MarvelService } from './marvel/marvel.service'
import { HttpModule } from '@nestjs/axios'
import { CommonModule } from '../common/common.module'

@Module({
  imports: [HttpModule, CommonModule],
  providers: [MarvelService],
  exports: [MarvelService],
})
export class VendorModule {}
