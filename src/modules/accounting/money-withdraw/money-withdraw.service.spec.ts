import { Test, TestingModule } from '@nestjs/testing';
import { MoneyWithdrawService } from './money-withdraw.service';

describe('MoneyWithdrawService', () => {
  let service: MoneyWithdrawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoneyWithdrawService],
    }).compile();

    service = module.get<MoneyWithdrawService>(MoneyWithdrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
