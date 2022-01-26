import { Test, TestingModule } from '@nestjs/testing';
import { ControlDteController } from './control-dte.controller';

describe('ControlDteController', () => {
  let controller: ControlDteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlDteController],
    }).compile();

    controller = module.get<ControlDteController>(ControlDteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
