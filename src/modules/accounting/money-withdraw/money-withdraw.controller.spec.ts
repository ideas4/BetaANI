import { Test, TestingModule } from '@nestjs/testing';
import { MoneyWithdrawController } from './money-withdraw.controller';
import { MoneyWithdrawService } from './money-withdraw.service';

describe('MoneyWithdrawController', () => {
  let controller: MoneyWithdrawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoneyWithdrawController],
      providers: [MoneyWithdrawService],
    }).compile();

    controller = module.get<MoneyWithdrawController>(MoneyWithdrawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
