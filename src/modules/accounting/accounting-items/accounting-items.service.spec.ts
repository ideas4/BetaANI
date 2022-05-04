import { Test, TestingModule } from '@nestjs/testing';
import { AccountingItemsService } from './accounting-items.service';

describe('AccountingItemsService', () => {
  let service: AccountingItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountingItemsService],
    }).compile();

    service = module.get<AccountingItemsService>(AccountingItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
