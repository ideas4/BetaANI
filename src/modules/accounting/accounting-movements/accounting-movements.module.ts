import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTypeController } from '../accounts/account-type.controller';
import { AccountingMovementsController } from './controllers/accounting-movements/accounting-movements.controller';
import { AccountingMovement } from './entities/accounting-movement.entity';
import { AccountingMovementsService } from './services/accounting-movements/accounting-movements.service';
import { AccountController } from '../accounts/account.controller';
import { AccountingMovementType } from './entities/accounting-movement-type.entity';
import { AccountingMovementTypeController } from './controllers/accounting-movement-type/accounting-movement-type.controller';
import { AccountingMovementTypeService } from './services/accounting-movement-type/accounting-movement-type.service';
import { Account } from '../accounts/entities/account.entity';
import { AccountType } from '../accounts/entities/account-type.entity';
import { AccountTypeService } from '../accounts/services/account-type.service';
import { AccountService } from '../accounts/services/account.service';

@Module({
  imports:[TypeOrmModule.forFeature([Account,AccountingMovement,AccountType,
  AccountingMovementType,])],
  controllers: [AccountingMovementsController,AccountTypeController, AccountController,
  AccountingMovementTypeController],
  providers: [AccountingMovementsService,AccountTypeService, AccountService,AccountingMovementTypeService]
})
export class AccountingMovementsModule {}
