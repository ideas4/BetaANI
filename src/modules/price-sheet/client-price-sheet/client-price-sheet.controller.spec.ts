import { Test, TestingModule } from '@nestjs/testing';
import { ClientPriceSheetController } from './client-price-sheet.controller';

describe('ClientPriceSheetController', () => {
  let controller: ClientPriceSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPriceSheetController],
    }).compile();

    controller = module.get<ClientPriceSheetController>(ClientPriceSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
