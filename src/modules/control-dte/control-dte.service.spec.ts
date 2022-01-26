import { Test, TestingModule } from '@nestjs/testing';
import { ControlDteService } from './control-dte.service';

describe('ControlDteService', () => {
  let service: ControlDteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlDteService],
    }).compile();

    service = module.get<ControlDteService>(ControlDteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
