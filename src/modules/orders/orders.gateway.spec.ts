import { Test, TestingModule } from '@nestjs/testing';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/requestDTO/create-order.dto';
import { Server, Socket } from 'socket.io';

describe('OrdersGateway', () => {
  let gateway: OrdersGateway;
  let ordersService: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
  };

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  const mockSocket: Partial<Socket> = {
    emit: jest.fn(),
    join: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersGateway,
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    gateway = module.get<OrdersGateway>(OrdersGateway);
    ordersService = module.get<OrdersService>(OrdersService);
    gateway.server = mockServer as unknown as Server; // Mock server
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and emit events', async () => {
      const createOrderDto: CreateOrderDto = {
        tableId: 'table_id',
        items: [
          {
            productId: 'product_id',
            note: 'note',
            quantity: 1,
          },
        ],
        totalPrice: 1000,
      };

      const mockOrder = {
        _id: 'order_id',
        tableId: 'table_id',
        items: [
          {
            productId: 'product_id',
            note: 'note',
            quantity: 1,
          },
        ],
        totalPrice: 1000,
      };

      mockOrdersService.create.mockResolvedValue(mockOrder); // Mock service response

      await gateway.create(createOrderDto, mockSocket as Socket);

      // Kiểm tra service.create được gọi với đúng tham số
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);

      // Kiểm tra server.emit được gọi để phát sự kiện tới "owner" room
      expect(mockServer.to).toHaveBeenCalledWith('owner');
      expect(mockServer.emit).toHaveBeenCalledWith('orderCreated', mockOrder);

      // Kiểm tra client.emit được gọi để phản hồi cho client
      expect(mockSocket.emit).toHaveBeenCalledWith('orderCreatedAck', mockOrder);
    });
  });

  describe('joinOwnerRoom', () => {
    it('should join the owner room and emit a confirmation', () => {
      gateway.joinOwnerRoom(mockSocket as Socket);

      // Kiểm tra client.join được gọi với room "owner"
      expect(mockSocket.join).toHaveBeenCalledWith('owner');

      // Kiểm tra client.emit được gọi để xác nhận tham gia room
      expect(mockSocket.emit).toHaveBeenCalledWith('joinedOwnerRoom', {
        message: 'You have joined the owner room',
      });
    });
  });
});
