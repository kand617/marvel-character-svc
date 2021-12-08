import { Test, TestingModule } from '@nestjs/testing'
import * as moment from 'moment'
import { MarvelService } from '../vendor/marvel/marvel.service'
import { CharactersService } from './characters.service'

const mockCharacters = [
  {
    id: 1,
    name: 'Piledriver',
    description: '',
    modified: '2020-12-31T19:00:00-0500',
  },
  {
    id: 2,
    name: 'Captian America',
    description: '',
    modified: '2021-12-31T19:00:00-0500',
  },
]

describe('CharactersService', () => {
  let service: CharactersService
  let marvelService: MarvelService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersService],
    })
      .useMocker((token) => {
        if (token === MarvelService) {
          return { getCharacters: jest.fn().mockResolvedValue(mockCharacters) }
        }
      })
      .compile()

    service = module.get<CharactersService>(CharactersService)
    marvelService = module.get<MarvelService>(MarvelService)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })

  describe('.init', () => {
    describe('when there is no saved latest_modified_date', () => {
      beforeEach(async () => {
        await service.init()
      })
      it('should invoke marvel service with no date', async () => {
        expect(marvelService.getCharacters).toHaveBeenCalled()
      })
      it('should correctly track the latest update', async () => {
        const expectedLatest = moment.parseZone(mockCharacters[1].modified)
        expect(service.latest_modified_date.toString()).toEqual(
          expectedLatest.toString(),
        )
      })
      it('should store the new data', async () => {
        expect(service.getCharacterIds()).toEqual([1, 2])
      })
    })

    describe('when there is a latest_modified_date', () => {
      it('should invoke marvel service with saved date', async () => {
        service.latest_modified_date = moment()
        const expected_time = service.latest_modified_date.format(
          'YYYY-MM-DDThh:mm:ssZZ',
        )
        // marvelService.getCharacters.mockImplementation(() => Promise.resolve([]))
        await service.init()
        expect(marvelService.getCharacters).toHaveBeenCalledWith(expected_time)
      })
    })
  })

  describe('.getCharacter', () => {
    it('should return a single character', async () => {
      await service.init()
      const returnedCharacter = service.getCharacter(1)
      expect(returnedCharacter.id).toBe(1)
    })
  })
  describe('.getCharacterIds', () => {
    it('should return all character ids', async () => {
      await service.init()
      const ids = service.getCharacterIds()
      expect(ids).toEqual([1, 2])
    })
  })
})
