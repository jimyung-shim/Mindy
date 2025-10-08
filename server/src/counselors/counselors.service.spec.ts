import { Test, TestingModule } from '@nestjs/testing';
import { CounselorsService } from './counselors.service';

describe('CounselorsService', () => {
  let service: CounselorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounselorsService],
    }).compile();

    service = module.get<CounselorsService>(CounselorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
