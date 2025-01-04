import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/requestDTO/create-order.dto';
import { UpdateOrderDto } from './dto/requestDTO/update-order.dto';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly ordersService: OrdersService) { }

  @SubscribeMessage('createOrder')
  async create(
    @MessageBody() createOrderDto: CreateOrderDto,
    @ConnectedSocket() client: Socket
  ) {
    const newOrder = await this.ordersService.create(createOrderDto);

    // Phát sự kiện tới tất cả client trong room "owner" (chủ quán)
    this.server.to('owner').emit('orderCreated', newOrder);

    // Phản hồi cho khách hàng đã gửi yêu cầu
    client.emit('orderCreatedAck', newOrder);

    return newOrder;
  }

  @SubscribeMessage('joinOwnerRoom')
  joinOwnerRoom(@ConnectedSocket() client: Socket) {
    client.join('owner');
    client.emit('joinedOwnerRoom', { message: 'You have joined the owner room' });
  }

  
}
