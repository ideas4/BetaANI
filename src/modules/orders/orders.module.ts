import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from './entities/order-status.entity';
import { OrderType } from './entities/order-type.entity';
import { Order } from './entities/order.entity';
import { DeliveryType } from './entities/delivery-type.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { ProductOrder } from './entities/product-order.entity';
import { User } from '../users/entities/user.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { LogInventoryService } from '../inventory/services/log-inventory/log-inventory.service';
import { LogInventory } from '../inventory/entities/log-inventory.entity';
import { PdfGeneratorService } from 'src/services/pdf-generator/pdf-generator.service';
import { Store } from '../stores/entities/store.entity';
import { Shipping } from '../shipping/entities/shipping.entity';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';
import { ConfigService } from '../configurations/config-admin/config.service';
import { SenderMailModule } from '../../services/mailer/mailer.module';
import { SendMailService } from '../../services/mailer/send-mail.service';
import { CreditCardsService } from '../accounting/credit-cards/credit-cards.service';
import { CreditCard } from '../accounting/credit-cards/entities/credit-card.entity';
import { SalesService } from '../sales/sales.service';
import { SaleEntity } from '../sales/entities/sale.entity';
import { LogBookService } from '../accounting/log-book/log-book.service';
import { LogBook } from '../accounting/log-book/entities/log-book.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DeliveryType,
    OrderStatus,
    OrderType,
    Order,
    PaymentMethod,
    User,
    Inventory,
    LogInventory,
    Store,
    Shipping,
    Config,
    CreditCard,
    ConfigEcommerce,
    SaleEntity,
    CreditCard,
    LogBook,
    ProductOrder]),
    SenderMailModule,
    ],
  controllers: [OrdersController],
  providers: [OrdersService,InventoryService,LogInventoryService,ConfigService,PdfGeneratorService,SendMailService,
    SalesService,
    CreditCardsService,
  LogBookService]
})
export class OrdersModule {}
