import { Test, TestingModule } from '@nestjs/testing';
import { CounselorsController } from './counselors.controller';

describe('CounselorsController', () => {
  let controller: CounselorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounselorsController],
    }).compile();

    controller = module.get<CounselorsController>(CounselorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
