import { Test, TestingModule } from '@nestjs/testing';
import { BanksResolver } from '../banks.resolver';
import { BanksService } from '../banks.service';

describe('BanksResolver', () => {
  let resolver: BanksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanksResolver, BanksService],
    }).compile();

    resolver = module.get<BanksResolver>(BanksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
