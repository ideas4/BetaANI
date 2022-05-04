import { Test, TestingModule } from '@nestjs/testing';
import { AccountingItemsController } from './accounting-items.controller';

describe('AccountingItemsController', () => {
  let controller: AccountingItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountingItemsController],
    }).compile();

    controller = module.get<AccountingItemsController>(AccountingItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
