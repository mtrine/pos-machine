import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateInvoiceDto } from './dto/requestDTO/create-invoice.dto';
import { NotFoundException } from '@nestjs/common';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let invoiceModel: Model<Invoice>;
  let orderModel: Model<Order>;
  let productModel: Model<Product>;

  const mockInvoiceModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockOrderModel = {
    find: jest.fn(),
  };

  const mockProductModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    invoiceModel = module.get<Model<Invoice>>(getModelToken(Invoice.name));
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockCreateInvoiceDto: CreateInvoiceDto = {
      orderId: ['order1', 'order2'],
      note: 'Test invoice',
    };

    const mockOrders = [
      {
        _id: 'order1',
        products: [
          {
            product: { _id: 'product1', name: 'Product 1', price: 100 },
            quantity: 2,
          },
        ],
      },
      {
        _id: 'order2',
        products: [
          {
            product: { _id: 'product2', name: 'Product 2', price: 150 },
            quantity: 1,
          },
        ],
      },
    ];

    const mockNewInvoice = {
      _id: 'invoice1',
      orderIds: ['order1', 'order2'],
      items: [
        {
          product: { _id: 'product1', name: 'Product 1', price: 100 },
          quantity: 2,
          totalPrice: 200,
        },
        {
          product: { _id: 'product2', name: 'Product 2', price: 150 },
          quantity: 1,
          totalPrice: 150,
        },
      ],
      totalPrice: 350,
      note: 'Test invoice',
    };

    it('should create an invoice successfully', async () => {
      mockOrderModel.find.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockOrders),
        }),
      }));

      mockInvoiceModel.create.mockResolvedValue(mockNewInvoice);

      const result = await service.create(mockCreateInvoiceDto);

      expect(mockOrderModel.find).toHaveBeenCalledWith({
        _id: { $in: mockCreateInvoiceDto.orderId },
      });
      expect(mockInvoiceModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockNewInvoice);
    });

    it('should throw NotFoundException if orders are not found', async () => {
      mockOrderModel.find.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([mockOrders[0]]), // Only one order found
        }),
      }));

      await expect(service.create(mockCreateInvoiceDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    const mockInvoices = [
      {
        _id: 'invoice1',
        items: [],
        totalPrice: 100,
      },
      {
        _id: 'invoice2',
        items: [],
        totalPrice: 200,
      },
    ];

    it('should return all invoices', async () => {
      mockInvoiceModel.find.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockInvoices),
        }),
      }));

      const result = await service.findAll();

      expect(mockInvoiceModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockInvoices);
    });
  });

  describe('findOne', () => {
    const mockInvoice = {
      _id: 'invoice1',
      items: [],
      totalPrice: 100,
    };

    it('should return an invoice by id', async () => {
      mockInvoiceModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockInvoice),
        }),
      }));

      const result = await service.findOne('invoice1');

      expect(mockInvoiceModel.findById).toHaveBeenCalledWith('invoice1');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      mockInvoiceModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      }));

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const mockInvoice = {
      _id: 'invoice1',
      items: [],
      totalPrice: 100,
    };

    it('should delete an invoice successfully', async () => {
      mockInvoiceModel.findByIdAndDelete.mockResolvedValue(mockInvoice);

      const result = await service.remove('invoice1');

      expect(mockInvoiceModel.findByIdAndDelete).toHaveBeenCalledWith(
        'invoice1',
      );
      expect(result).toEqual(mockInvoice);
    });

    it('should throw NotFoundException if invoice to delete is not found', async () => {
      mockInvoiceModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
