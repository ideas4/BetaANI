import { Test, TestingModule } from '@nestjs/testing';
import { DepositTypeService } from './deposit-type.service';

describe('DepositTypeService', () => {
  let service: DepositTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositTypeService],
    }).compile();

    service = module.get<DepositTypeService>(DepositTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
