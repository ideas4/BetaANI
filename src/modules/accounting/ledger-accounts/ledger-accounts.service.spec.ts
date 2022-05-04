import { Test, TestingModule } from '@nestjs/testing';
import { LedgerAccountsService } from './ledger-accounts.service';

describe('LedgerAccountsService', () => {
  let service: LedgerAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LedgerAccountsService],
    }).compile();

    service = module.get<LedgerAccountsService>(LedgerAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
