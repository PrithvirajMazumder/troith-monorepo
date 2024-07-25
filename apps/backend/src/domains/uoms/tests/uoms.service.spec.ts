import { Test, TestingModule } from '@nestjs/testing';
import { UomsService } from '../uoms.service';

describe('UomsService', () => {
  let service: UomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UomsService],
    }).compile();

    service = module.get<UomsService>(UomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
