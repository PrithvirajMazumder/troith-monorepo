import { Test, TestingModule } from '@nestjs/testing';
import { TaxesResolver } from '../taxes.resolver';
import { TaxesService } from '../taxes.service';

describe('TaxesResolver', () => {
  let resolver: TaxesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxesResolver, TaxesService],
    }).compile();

    resolver = module.get<TaxesResolver>(TaxesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
