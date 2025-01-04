import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Table, TableSchema } from '../tables/schemas/table.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name:Order.name, schema:OrderSchema},{name:Table.name, schema:TableSchema},{name:Product.name, schema:ProductSchema}])
  ],
  controllers:[OrdersController],
  providers: [OrdersGateway, OrdersService],
})
export class OrdersModule {}
