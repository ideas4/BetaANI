import { Test, TestingModule } from '@nestjs/testing';
import { DetailBillController } from './detail-bill.controller';

describe('DetailBillController', () => {
  let controller: DetailBillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailBillController],
    }).compile();

    controller = module.get<DetailBillController>(DetailBillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
