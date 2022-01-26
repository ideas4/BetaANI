import { Test, TestingModule } from '@nestjs/testing';
import { LogBookService } from './log-book.service';

describe('LogBookService', () => {
  let service: LogBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogBookService],
    }).compile();

    service = module.get<LogBookService>(LogBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
