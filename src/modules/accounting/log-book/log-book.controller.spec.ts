import { Test, TestingModule } from '@nestjs/testing';
import { LogBookController } from './log-book.controller';
import { LogBookService } from './log-book.service';

describe('LogBookController', () => {
  let controller: LogBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogBookController],
      providers: [LogBookService],
    }).compile();

    controller = module.get<LogBookController>(LogBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
