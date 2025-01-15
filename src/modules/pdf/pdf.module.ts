import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
})
export class PdfModule {}
