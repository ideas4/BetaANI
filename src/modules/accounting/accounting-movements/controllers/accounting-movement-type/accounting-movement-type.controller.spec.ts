import { Test, TestingModule } from '@nestjs/testing';
import { AccountingMovementTypeService } from '../../services/accounting-movement-type/accounting-movement-type.service';
import { AccountingMovementTypeController } from './accounting-movement-type.controller';

describe('AccountingMovementTypeController', () => {
  let controller: AccountingMovementTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountingMovementTypeController],
      providers: [AccountingMovementTypeService],
    }).compile();

    controller = module.get<AccountingMovementTypeController>(AccountingMovementTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
