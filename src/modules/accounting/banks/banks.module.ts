import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { Bank } from './entities/bank.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Bank])],
  controllers: [BanksController],
  providers: [BanksService]
})
export class BanksModule {}
