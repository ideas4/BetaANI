import { Test, TestingModule } from '@nestjs/testing';
import { DepositTypeController } from './deposit-type.controller';

describe('DepositTypeController', () => {
  let controller: DepositTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositTypeController],
    }).compile();

    controller = module.get<DepositTypeController>(DepositTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
