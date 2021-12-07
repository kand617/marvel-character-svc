import { Module } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharactersController } from './characters.controller'
import { VendorModule } from '../vendor/vendor.module'
import { CharacterTaskService } from './character-task/character-task.service';

@Module({
  imports: [VendorModule],
  providers: [CharactersService, CharacterTaskService],
  controllers: [CharactersController],
})
export class CharactersModule {}
