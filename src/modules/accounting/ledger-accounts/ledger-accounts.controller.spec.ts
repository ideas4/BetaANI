import { Test, TestingModule } from '@nestjs/testing';
import { LedgerAccountsController } from './ledger-accounts.controller';

describe('LedgerAccountsController', () => {
  let controller: LedgerAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LedgerAccountsController],
    }).compile();

    controller = module.get<LedgerAccountsController>(LedgerAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
