import { Test, TestingModule } from '@nestjs/testing';
import { DetailPriceSheetController } from './detail-price-sheet.controller';

describe('DetailPriceSheetController', () => {
  let controller: DetailPriceSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailPriceSheetController],
    }).compile();

    controller = module.get<DetailPriceSheetController>(DetailPriceSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
