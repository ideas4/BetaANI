import { Test, TestingModule } from '@nestjs/testing';
import { AccountingMovementTypeService } from './accounting-movement-type.service';

describe('AccountingMovementTypeService', () => {
  let service: AccountingMovementTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountingMovementTypeService],
    }).compile();

    service = module.get<AccountingMovementTypeService>(AccountingMovementTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
