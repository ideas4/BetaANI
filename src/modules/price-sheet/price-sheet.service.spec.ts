import { Test, TestingModule } from '@nestjs/testing';
import { PriceSheetService } from './price-sheet.service';

describe('PriceSheetService', () => {
  let service: PriceSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceSheetService],
    }).compile();

    service = module.get<PriceSheetService>(PriceSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
