import { Test, TestingModule } from '@nestjs/testing';
import { PriceSheetController } from './price-sheet.controller';

describe('PriceSheetController', () => {
  let controller: PriceSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceSheetController],
    }).compile();

    controller = module.get<PriceSheetController>(PriceSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
