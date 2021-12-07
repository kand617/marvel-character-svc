import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { CharactersService } from './characters.service'

@Controller('characters')
export class CharactersController {
  constructor(private readonly svc: CharactersService) {}

  @Get()
  findAll() {
    return this.svc.getCharacterIds()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.getCharacter(id)
  }
}
