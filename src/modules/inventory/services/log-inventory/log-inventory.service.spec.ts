import { Test, TestingModule } from '@nestjs/testing';
import { LogInventoryService } from './log-inventory.service';

describe('LogInventoryService', () => {
  let service: LogInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogInventoryService],
    }).compile();

    service = module.get<LogInventoryService>(LogInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
