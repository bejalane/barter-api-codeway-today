import { Test, TestingModule } from '@nestjs/testing';
import { BarterController } from './barter.controller';

describe('Barter Controller', () => {
  let controller: BarterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarterController],
    }).compile();

    controller = module.get<BarterController>(BarterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
