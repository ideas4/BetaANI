import { Test, TestingModule } from '@nestjs/testing';
import { DetailPriceSheetService } from './detail-price-sheet.service';

describe('DetailPriceSheetService', () => {
  let service: DetailPriceSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailPriceSheetService],
    }).compile();

    service = module.get<DetailPriceSheetService>(DetailPriceSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
