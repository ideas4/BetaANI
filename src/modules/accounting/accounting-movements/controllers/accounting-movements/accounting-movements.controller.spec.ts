import { Test, TestingModule } from '@nestjs/testing';
import { AccountingMovementsService } from '../../services/accounting-movements/accounting-movements.service';
import { AccountingMovementsController } from './accounting-movements.controller';

describe('AccountingMovementsController', () => {
  let controller: AccountingMovementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountingMovementsController],
      providers: [AccountingMovementsService],
    }).compile();

    controller = module.get<AccountingMovementsController>(AccountingMovementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
