import { Test, TestingModule } from '@nestjs/testing';
import { ClientPriceSheetService } from './client-price-sheet.service';

describe('ClientPriceSheetService', () => {
  let service: ClientPriceSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPriceSheetService],
    }).compile();

    service = module.get<ClientPriceSheetService>(ClientPriceSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
