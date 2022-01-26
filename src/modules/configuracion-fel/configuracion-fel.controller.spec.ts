import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracionFelController } from './configuracion-fel.controller';

describe('ConfiguracionFelController', () => {
  let controller: ConfiguracionFelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfiguracionFelController],
    }).compile();

    controller = module.get<ConfiguracionFelController>(ConfiguracionFelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
