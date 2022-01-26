import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductQuoteEntity } from './entities/product-quote.entity';
import { QuoteEntity } from './entities/quote.entity';
import { QuoteStatusEntity } from './entities/quote-status.entity';
import { QuoteTimeEntity } from './entities/quote-time.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../users/entities/user.entity';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { ConfigService } from '../configurations/config-admin/config.service';
import { ConfigEcommerceService } from '../configurations/config-ecommerce/config-ecommerce.service';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { Store } from '../stores/entities/store.entity';
import { Product } from '../products/entities/product.entity';
import { FeaturedCategory } from '../configurations/config-ecommerce/entities/featured-categories.entity';
import { SendMailService } from '../../services/mailer/send-mail.service';
import { QuoteClientEntity } from './entities/quote-client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductQuoteEntity,
      QuoteEntity,
      QuoteStatusEntity,
      QuoteTimeEntity,
      Inventory,
      User,
      Config,
      ConfigEcommerce,
      Store,
      Product,
      FeaturedCategory,
      QuoteClientEntity,
    ]),
  ],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    PdfGeneratorService,
    ConfigService,
    ConfigEcommerceService,
    SendMailService,
  ],
})
export class QuoteModule {}
