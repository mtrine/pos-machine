import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:Order.name, schema:OrderSchema}])
  ],
  providers: [OrdersGateway, OrdersService],
})
export class OrdersModule {}
