import { Test, TestingModule } from '@nestjs/testing';
import { UomsResolver } from '../uoms.resolver';
import { UomsService } from '../uoms.service';

describe('UomsResolver', () => {
  let resolver: UomsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UomsResolver, UomsService],
    }).compile();

    resolver = module.get<UomsResolver>(UomsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
