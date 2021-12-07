import { Test, TestingModule } from '@nestjs/testing';
import { CharacterTaskService } from './character-task.service';

describe('CharacterTaskService', () => {
  let service: CharacterTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacterTaskService],
    }).compile();

    service = module.get<CharacterTaskService>(CharacterTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
