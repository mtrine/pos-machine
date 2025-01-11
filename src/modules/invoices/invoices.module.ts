import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
