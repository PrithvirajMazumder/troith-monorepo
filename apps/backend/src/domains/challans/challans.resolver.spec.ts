import { Test, TestingModule } from '@nestjs/testing';
import { ChallansResolver } from './challans.resolver';
import { ChallansService } from './challans.service';

describe('ChallansResolver', () => {
  let resolver: ChallansResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallansResolver, ChallansService],
    }).compile();

    resolver = module.get<ChallansResolver>(ChallansResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
