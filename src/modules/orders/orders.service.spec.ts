import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import { Table } from '../tables/schemas/table.schema';
import { Cache } from 'cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OrderStatus } from 'src/enums/oder-status.enum';
import { mock } from 'node:test';
import { find } from 'rxjs';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: Model<Order>
  let productModel: Model<Product>
  let tableModel: Model<Table>
  let cacheManager: Cache

  const mockQuery = {
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    exec: jest.fn()
  };

  const mockOrderModel = {
    find: jest.fn(() => mockQuery),
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  };

  const mockProductModel = {
    find: jest.fn()
  }

  const mockTableModel = {
    findById: jest.fn(),
    save: jest.fn()
  }

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel
        },
        {
          provide: getModelToken(Table.name),
          useValue: mockTableModel
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
    tableModel = module.get<Model<Table>>(getModelToken(Table.name));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto = {
        tableId: 'table_id',
        items: [
          {
            productId: 'product_id',
            note: 'note',
            quantity: 1
          }
        ],
        totalPrice: 1000
      }

      const mockTable = {
        _id: 'table_id',
        name: 'Table 1'
      }

      const mockProduct = {
        _id: 'product_id',
        name: 'Product 1',
        price: 1000
      }

      const mockOrder = {
        _id: 'order_id',
        table: mockTable,
        items: [
          {
            _id: mockProduct._id,
            name: mockProduct.name,
            note: 'note',
            quantity: 1
          }
        ]
      }

      mockTableModel.findById.mockResolvedValue(mockTable);
      mockProductModel.find.mockResolvedValue([mockProduct]);
      mockOrderModel.create.mockResolvedValue(mockOrder);
      const result = await service.create(createOrderDto);
      expect(result).toEqual(mockOrder);
    })
  })

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          _id: 'order_id',
          table: {
            _id: 'table_id',
            name: 'Table 1'
          },
          items: [
            {
              _id: 'product_id',
              name: 'Product 1',
              note: 'note',
              quantity: 1
            }
          ]
        }
      ];

      mockQuery.exec.mockResolvedValue(mockOrders); // Mock giá trị trả về của exec
      const result = await service.findAll();
      expect(result).toEqual(mockOrders);
      expect(mockOrderModel.find).toHaveBeenCalled();
      expect(mockQuery.limit).toHaveBeenCalledWith(10); // Kiểm tra tham số `limit`
      expect(mockQuery.skip).toHaveBeenCalledWith(0);  // Kiểm tra tham số `skip`
    });
  });

  describe('findOne', () => {
    it('should return an order', async () => {
      const mockOrder = {
        _id: 'order_id',
        table: {
          _id: 'table_id',
          name: 'Table 1'
        },
        items: [
          {
            _id: 'product_id',
            name: 'Product 1',
            note: 'note',
            quantity: 1
          }
        ]
      }

      mockOrderModel.findById.mockResolvedValue(mockOrder);
      mockCacheManager.get.mockResolvedValue(null);
      mockCacheManager.set.mockResolvedValue(true);
      const result = await service.findOne('order_id');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto = {
        status: OrderStatus.PREPARING
      }

      const mockOrder = {
        _id: 'order_id',
        table: {
          _id: 'table_id',
          name: 'Table 1'
        },
        items: [
          {
            _id: 'product_id',
            name: 'Product 1',
            note: 'note',
            quantity: 1
          }
        ]
      }

      mockOrderModel.findById.mockResolvedValue(mockOrder);
      mockOrderModel.findByIdAndUpdate.mockResolvedValue(mockOrder);
      mockCacheManager.set.mockResolvedValue(true);
      const result = await service.update('order_id', updateOrderDto);
      expect(result).toEqual(mockOrder);
    })
  });
  
  describe('delete', () => {
    it('should delete an order', async () => {
      const mockOrder = {
        _id: 'order_id',
        table: {
          _id: 'table_id',
          name: 'Table 1'
        },
        items: [
          {
            _id: 'product_id',
            name: 'Product 1',
            note: 'note',
            quantity: 1
          }
        ]
      }

      mockOrderModel.findByIdAndDelete.mockResolvedValue(mockOrder);
      mockCacheManager.del.mockResolvedValue(true);
      const result = await service.remove('order_id');
      expect(result).toEqual(mockOrder);
    })
  })
});
