import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { CharactersService } from './characters.service'

@Controller('characters')
export class CharactersController {
  constructor(private readonly svc: CharactersService) {}

  @Get()
  findAllIds(): number[] {
    return this.svc.getCharacterIds()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const c = this.svc.getCharacter(id)
    if (!c) {
      throw new NotFoundException(`A character with ${id} does not exist`)
    } else {
      return c
    }
  }
}
