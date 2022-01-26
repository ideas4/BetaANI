import { Test, TestingModule } from '@nestjs/testing';
import { AccountingMovementsService } from './accounting-movements.service';

describe('AccountingMovementsService', () => {
  let service: AccountingMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountingMovementsService],
    }).compile();

    service = module.get<AccountingMovementsService>(AccountingMovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
