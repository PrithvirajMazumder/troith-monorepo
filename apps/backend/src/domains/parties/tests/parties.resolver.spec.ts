import { Test, TestingModule } from '@nestjs/testing';
import { PartiesResolver } from '../parties.resolver';
import { PartiesService } from '../parties.service';

describe('PartiesResolver', () => {
  let resolver: PartiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartiesResolver, PartiesService],
    }).compile();

    resolver = module.get<PartiesResolver>(PartiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
