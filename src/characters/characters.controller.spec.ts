import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Character } from './character.interface'
import { CharactersController } from './characters.controller'
import { CharactersService } from './characters.service'

describe('CharactersController', () => {
  let controller: CharactersController

  let svc: CharactersService
  const mockCharacter: Character = {
    id: 1,
    name: 'Piledriver',
    description: '',
  }
  const mockCharacterIds = [1, 2]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
    })
      .useMocker((token) => {
        if (token === CharactersService) {
          return {
            getCharacter: jest.fn().mockReturnValue(mockCharacter),
            getCharacterIds: jest.fn().mockReturnValue(mockCharacterIds),
          }
        }
      })
      .compile()
    controller = module.get<CharactersController>(CharactersController)
    svc = module.get<CharactersService>(CharactersService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('.findAll', () => {
    describe('when character exists', () => {
      it('should returns a non empty set of ids', async () => {
        const results = controller.findAllIds()
        expect(svc.getCharacterIds).toHaveBeenCalled()
        expect(results).toHaveLength(2)
      })
    })

    describe('when character does not exists', () => {
      it('should return empty array ', async () => {
        jest.spyOn(svc, 'getCharacterIds').mockImplementation(() => [])
        const results = controller.findAllIds()
        expect(svc.getCharacterIds).toHaveBeenCalled()
        expect(results).toEqual([])
      })
    })
  })

  describe('.findOne', () => {
    describe('when character exists', () => {
      it('should returns a character', async () => {
        const results = controller.findOne(1)
        expect(svc.getCharacter).toHaveBeenCalled()
        expect(results).toEqual(mockCharacter)
      })
    })

    describe('when character does not exists', () => {
      it('should raise an NotFoundException exception', async () => {
        jest.spyOn(svc, 'getCharacter').mockImplementation(() => undefined)
        const t = () => {
          controller.findOne(1)
        }
        expect(t).toThrow(NotFoundException)
      })
    })
  })
})
