import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';


describe('OrdersController', () => {
    let controller: OrdersController;
    let service: OrdersService;

    const mockOrdersService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [{
                provide: OrdersService,
                useValue: mockOrdersService,
            }],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
        service = module.get<OrdersService>(OrdersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of orders', async () => {
            const result = [{
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
            }];
            mockOrdersService.findAll.mockResolvedValue(result);
            expect(await controller.findAll()).toBe(result);
        });
    })

    describe('findOne',()=>{
        it('should return an order', async () => {
            const result = {
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
            mockOrdersService.findOne.mockResolvedValue(result);
            expect(await controller.findOne('order_id')).toBe(result);
        })
    })
});
