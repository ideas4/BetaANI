import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponType } from './entities/coupon-value-type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Coupon,CouponType])],
  controllers: [CouponsController],
  providers: [CouponsService]
})
export class CouponsModule {}
