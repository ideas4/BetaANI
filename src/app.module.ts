import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import { StoresModule } from './modules/stores/stores.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SalesModule } from './modules/sales/sales.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PdfGeneratorService } from './services/pdf-generator/pdf-generator.service';
import { ConfigModule } from './modules/configurations/config-admin/config.module';
import { ENTITIES } from './entities';
import { ConfigEcommerceModule } from './modules/configurations/config-ecommerce/config-ecommerce.module';
import { DatabaseInfo } from './constants';
import { ShippingModule } from './modules/shipping/shipping.module';
import { ConfigService } from './modules/configurations/config-admin/config.service';
import { ConfigEcommerce } from './modules/configurations/config-ecommerce/entities/config-ecommerce.entity';
import { Config } from './modules/configurations/config-admin/entities/config.entity';
import { QuoteModule } from './modules/quote/quote.module';
import { SendMailService } from './services/mailer/send-mail.service';
import { LogBookModule } from './modules/accounting/log-book/log-book.module';
import { BillModule } from './modules/bill/bill.module';
import { ControlDteModule } from './modules/control-dte/control-dte.module';
import { ConfiguracionFelModule } from './modules/configuracion-fel/configuracion-fel.module';
import { PriceSheetModule } from './modules/price-sheet/price-sheet.module';
import { AppointmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [
    //configuración de base de datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      ...DatabaseInfo,
      entities: [...ENTITIES],
      synchronize: false, //FALSO EN PRODUCCION
    }),
    //servicio de archivos estaticos
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UsersModule,
    SalesModule,
    AccountingModule,
    InventoryModule,
    StoresModule,
    SuppliersModule,
    CustomersModule,
    OrdersModule,
    ReportsModule,
    ConfigModule,
    ConfigEcommerceModule,
    ShippingModule,
    TypeOrmModule.forFeature([Config, ConfigEcommerce]),
    QuoteModule,
    LogBookModule,
    BillModule,
    ControlDteModule,
    ConfiguracionFelModule,
    PriceSheetModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
    ConfigService,
    PdfGeneratorService,
    SendMailService,
  ],
})
export class AppModule {}
