import { Module } from '@nestjs/common';
import { RiskClassifierService } from './risk.classifier.service';

@Module({
  providers: [RiskClassifierService],
  exports: [RiskClassifierService],
})
export class RiskModule {}
