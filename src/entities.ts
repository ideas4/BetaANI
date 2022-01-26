import { Color } from './modules/products/colors/entities/color.entity';
import { Spec } from './modules/products/specs/entities/spec.entity';
import { SpecProduct } from './modules/products/specs/entities/spec-product.entity';
import { Product } from './modules/products/entities/product.entity';
import { ProductOrder } from './modules/orders/entities/product-order.entity';
import { Brand } from './modules/products/brands/entities/brand.entity';
import { Category } from './modules/products/categories/entities/category.entity';
import { Supplier } from './modules/suppliers/entities/supplier.entity';
import { ImageProduct } from './modules/products/entities/img-product.entity';
import { Inventory } from './modules/inventory/entities/inventory.entity';
import { LogInventory } from './modules/inventory/entities/log-inventory.entity';
import { Store } from './modules/stores/entities/store.entity';
import { User } from './modules/users/entities/user.entity';
import { AccountingMovement } from './modules/accounting/accounting-movements/entities/accounting-movement.entity';
import { AccountingMovementType } from './modules/accounting/accounting-movements/entities/accounting-movement-type.entity';
import { RolUser } from './modules/users/entities/rol.entity';
import { StatuslUser } from './modules/users/entities/user-status.entity';
import { Order } from './modules/orders/entities/order.entity';
import { DeliveryType } from './modules/orders/entities/delivery-type.entity';
import { OrderStatus } from './modules/orders/entities/order-status.entity';
import { PaymentMethod } from './modules/orders/entities/payment-method.entity';
import { OrderType } from './modules/orders/entities/order-type.entity';
import { Coupon } from './modules/sales/coupons/entities/coupon.entity';
import { CouponType } from './modules/sales/coupons/entities/coupon-value-type.entity';
import { Bank } from './modules/accounting/banks/entities/bank.entity';
import { BankAccount } from './modules/accounting/bank-accounts/entities/bank-account.entity';
import { BankAccountType } from './modules/accounting/bank-accounts/entities/bank-account-type.entity';
import { Deposit } from './modules/accounting/deposits/entities/deposit.entity';
import { DepositType } from './modules/accounting/deposits/entities/deposit-type.entity';
import { Customer } from './modules/customers/entities/customer.entity';
import { Config } from './modules/configurations/config-admin/entities/config.entity';
import { FeaturedCategory } from './modules/configurations/config-ecommerce/entities/featured-categories.entity';
import { ConfigEcommerce } from './modules/configurations/config-ecommerce/entities/config-ecommerce.entity';
import { Shipping } from './modules/shipping/entities/shipping.entity';
import { AccessLog } from './modules/users/entities/access-log.entity';
import { RelationProducts } from './modules/products/entities/relation-products.entity';
import { ProductQuoteEntity } from './modules/quote/entities/product-quote.entity';
import { QuoteEntity } from './modules/quote/entities/quote.entity';
import { QuoteStatusEntity } from './modules/quote/entities/quote-status.entity';
import { QuoteTimeEntity } from './modules/quote/entities/quote-time.entity';
import { Account } from './modules/accounting/accounts/entities/account.entity';
import { AccountType } from './modules/accounting/accounts/entities/account-type.entity';
import { Check } from './modules/accounting/checks/entities/check.entity';
import { CreditCard } from './modules/accounting/credit-cards/entities/credit-card.entity';
import { SaleEntity } from './modules/sales/entities/sale.entity';
import { LogBook } from './modules/accounting/log-book/entities/log-book.entity';
import { MoneyWithdraw } from './modules/accounting/money-withdraw/entities/money-withdraw.entity';
import { MoneyWithdrawType } from './modules/accounting/money-withdraw/entities/withdraw-type.entity';
import { QuoteClientEntity } from './modules/quote/entities/quote-client.entity';
import { Bill } from './modules/bill/entities/bill.entity';
import { DetailBill } from './modules/bill/detail-bill/entities/detailBill.entity';
import { ControlDte } from './modules/control-dte/entities/control-dte.entity';
import { ConfiguracionFel } from './modules/configuracion-fel/entities/configuracion-fel.entity';
import { PriceSheet } from './modules/price-sheet/entities/price-sheet.entity';
import { DetailPriceSheet } from './modules/price-sheet/detail-price-sheet/entities/detail-price-sheet.entity';
import { ClientPriceSheet } from './modules/price-sheet/client-price-sheet/entities/client-priceSheet.entity';
import { Appointment } from './modules/appointment/entities/appointment.entity';
import { AppointmentType } from './modules/appointment/appointment-type/entities/appointment-type.entity';

export const ENTITIES = [
  Color,
  Spec,
  SpecProduct,
  Product,
  ProductOrder,
  Brand,
  Category,
  Supplier,
  ImageProduct,
  Inventory,
  LogInventory,
  Store,
  User,
  Account,
  AccountingMovement,
  AccountType,
  AccountingMovementType,
  Appointment,
  AppointmentType,
  RolUser,
  StatuslUser,
  Order,
  ProductOrder,
  DeliveryType,
  OrderStatus,
  PaymentMethod,
  OrderType,
  Coupon,
  CouponType,
  Bank,
  BankAccount,
  BankAccountType,
  Bill,
  DetailBill,
  ControlDte,
  ConfiguracionFel,
  ClientPriceSheet,
  Deposit,
  DepositType,
  Customer,
  SaleEntity,
  Config,
  FeaturedCategory,
  ConfigEcommerce,
  AccessLog,
  RelationProducts,
  Shipping,
  ProductQuoteEntity,
  PriceSheet,
  DetailPriceSheet,
  QuoteEntity,
  QuoteStatusEntity,
  QuoteTimeEntity,
  Check,
  CreditCard,
  LogBook,
  MoneyWithdraw,
  MoneyWithdrawType,
  QuoteClientEntity,
];
