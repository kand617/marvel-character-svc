import { Injectable } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { CharactersService } from '../characters.service'

@Injectable()
export class CharacterTaskService {
  constructor(private readonly svc: CharactersService) {}

  @Interval('CharacterRefresh', 60000)
  handleInterval() {
    this.svc.init()
  }
}
