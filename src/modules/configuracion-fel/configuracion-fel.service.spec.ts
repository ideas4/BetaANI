import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracionFelService } from './configuracion-fel.service';

describe('ConfiguracionFelService', () => {
  let service: ConfiguracionFelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguracionFelService],
    }).compile();

    service = module.get<ConfiguracionFelService>(ConfiguracionFelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
