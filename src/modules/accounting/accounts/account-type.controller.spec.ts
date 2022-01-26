import { Test, TestingModule } from '@nestjs/testing';
import { AccountTypeService } from './services/account-type.service';
import { AccountTypeController } from './account-type.controller';

describe('AccountingItemTypeController', () => {
  let controller: AccountTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountTypeController],
      providers: [AccountTypeService],
    }).compile();

    controller = module.get<AccountTypeController>(AccountTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
