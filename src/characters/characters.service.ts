import { Injectable, Logger } from '@nestjs/common'
import { Moment } from 'moment'
import { MarvelService } from '../vendor/marvel/marvel.service'
import { Character } from './character.interface'
import * as moment from 'moment'
import { CharacterDTO } from '../vendor/marvel/character-response.dto'

const DATE_FORMAT = 'YYYY-MM-DDThh:mm:ssZZ'

@Injectable()
export class CharactersService {
  private readonly logger = new Logger(CharactersService.name)

  db: Map<number, Character>
  latest_modified_date: Moment = null
  constructor(private marvel: MarvelService) {
    this.db = new Map<number, Character>()
  }

  private updateLatestModifiedDate(c: CharacterDTO) {
    try {
      const new_date = moment.parseZone(c.modified)
      if (!new_date.isValid()) {
        this.logger.warn('Oops, we have a date parsing error', {
          characterId: c.id,
          modified: c.modified,
        })
        return
      }

      if (this.latest_modified_date == null) {
        this.latest_modified_date = new_date
        this.logger.debug('Latest date updated ', this.latest_modified_date)
      } else if (new_date.isAfter(this.latest_modified_date)) {
        this.latest_modified_date = new_date
        this.logger.debug('Latest date updated ', this.latest_modified_date)
      }
    } catch (error) {
      this.logger.error(
        'Oops, we had a issue updating the last modified date',
        { error: error },
      )
    }
  }
  public async init() {
    const from_date = this.latest_modified_date
      ? this.latest_modified_date.format(DATE_FORMAT)
      : null
    const characters = (await this.marvel.getCharacters(from_date)) || []
    characters.forEach((c) => {
      this.updateLatestModifiedDate(c)
      this.db.set(c.id, {
        id: c.id,
        name: c.name,
        description: c.description,
      })
    })
  }

  public getCharacter(id: number): Character {
    return this.db.get(id)
  }

  public getCharacterIds(): number[] {
    // TODO: FIX this memory usage
    const itms = Array.from(this.db.keys())
    return itms
  }
}
