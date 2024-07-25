import { Test, TestingModule } from '@nestjs/testing';
import { ChallansService } from './challans.service';

describe('ChallansService', () => {
  let service: ChallansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallansService],
    }).compile();

    service = module.get<ChallansService>(ChallansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
