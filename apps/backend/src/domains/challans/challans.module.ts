import { Module } from '@nestjs/common';
import { ChallansService } from './challans.service';
import { ChallansResolver } from './challans.resolver';

@Module({
  providers: [ChallansResolver, ChallansService],
})
export class ChallansModule {}
