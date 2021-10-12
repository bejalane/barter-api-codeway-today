import { Test, TestingModule } from '@nestjs/testing';
import { BarterService } from './barter.service';

describe('BarterService', () => {
  let service: BarterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarterService],
    }).compile();

    service = module.get<BarterService>(BarterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
