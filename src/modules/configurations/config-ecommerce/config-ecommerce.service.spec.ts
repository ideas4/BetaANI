import { Test, TestingModule } from '@nestjs/testing';
import { ConfigEcommerceService } from './config-ecommerce.service';

describe('ConfigEcommerceService', () => {
  let service: ConfigEcommerceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigEcommerceService],
    }).compile();

    service = module.get<ConfigEcommerceService>(ConfigEcommerceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
