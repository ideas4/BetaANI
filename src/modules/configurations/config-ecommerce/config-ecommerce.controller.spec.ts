import { Test, TestingModule } from '@nestjs/testing';
import { ConfigEcommerceController } from './config-ecommerce.controller';
import { ConfigEcommerceService } from './config-ecommerce.service';

describe('ConfigEcommerceController', () => {
  let controller: ConfigEcommerceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigEcommerceController],
      providers: [ConfigEcommerceService],
    }).compile();

    controller = module.get<ConfigEcommerceController>(ConfigEcommerceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
