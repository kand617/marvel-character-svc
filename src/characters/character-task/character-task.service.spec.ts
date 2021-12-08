import { Test, TestingModule } from '@nestjs/testing'
import { CharactersService } from '../characters.service'
import { CharacterTaskService } from './character-task.service'

describe('CharacterTaskService', () => {
  let taskService: CharacterTaskService
  let svc: CharactersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacterTaskService],
    })
      .useMocker((token) => {
        if (token === CharactersService) {
          return {
            init: jest.fn().mockResolvedValue([]),
          }
        }
      })
      .compile()

    taskService = module.get<CharacterTaskService>(CharacterTaskService)
    svc = module.get<CharactersService>(CharactersService)
  })

  it('should be defined', () => {
    expect(taskService).toBeDefined()
  })
  describe('.handleInterval', () => {
    it('should invoke init on character service', async () => {
      await taskService.handleInterval()
      expect(svc.init).toHaveBeenCalled()
    })
  })
})
