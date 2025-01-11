import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { getModelToken } from '@nestjs/mongoose'; // Import getModelToken nếu bạn sử dụng Mongoose

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockTableService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: mockTableService,
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const createInvoiceDto = { orderId: ['1'], note: 'Test unit' };
      const mockItems = [
        {
          productId: '1',
          name: 'pepsi',
          price: 15000,
          quantity: 1,
          totalPrice: 15000,
        },
      ];
      const mockTotalPrice = 15000;
      const mockCreatedInvoice = {
        orderIds: ['1'],
        items: mockItems,
        totalPrice: mockTotalPrice,
        note: 'unit test',
      };

      mockTableService.create.mockResolvedValue(mockCreatedInvoice);

      const result = await controller.create(createInvoiceDto);

      expect(mockTableService.create).toHaveBeenCalledWith(createInvoiceDto);
      expect(result).toEqual(mockCreatedInvoice);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const mockInvoices = [
        {
          orderIds: ['1'],
          items: [
            {
              productId: '1',
              name: 'pepsi',
              price: 15000,
              quantity: 1,
              totalPrice: 15000,
            },
          ],
          totalPrice: 15000,
          note: 'unit test',
        },
      ];
      mockTableService.findAll.mockResolvedValue(mockInvoices);

      const result = await controller.findAll();

      expect(mockTableService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockInvoices);
    });
  });

  describe('findOne', () => {
    it('should return an invoice', async () => {
      const mockInvoice = {
        orderIds: ['1'],
        items: [
          {
            productId: '1',
            name: 'pepsi',
            price: 15000,
            quantity: 1,
            totalPrice: 15000,
          },
        ],
        totalPrice: 15000,
        note: 'unit test',
      };
      mockTableService.findOne.mockResolvedValue(mockInvoice);

      const result = await controller.findOne('1');

      expect(mockTableService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const updateInvoiceDto = { orderId: ['1'], note: 'Test unit update' };
      const mockItems = [
        {
          productId: '1',
          name: 'pepsi',
          price: 15000,
          quantity: 1,
          totalPrice: 15000,
        },
      ];
      const mockTotalPrice = 15000;
      const mockUpdatedInvoice = {
        orderIds: ['1'],
        items: mockItems,
        totalPrice: mockTotalPrice,
        note: 'Test unit update',
      };

      mockTableService.update.mockResolvedValue(mockUpdatedInvoice);

      const result = await controller.update('1', updateInvoiceDto);

      expect(mockTableService.update).toHaveBeenCalledWith('1', updateInvoiceDto);
      expect(result).toEqual(mockUpdatedInvoice);
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      const mockInvoice = {
        orderIds: ['1'],
        items: [
          {
            productId: '1',
            name: 'pepsi',
            price: 15000,
            quantity: 1,
            totalPrice: 15000,
          },
        ],
        totalPrice: 15000,
        note: 'unit test',
      };
      mockTableService.remove.mockResolvedValue(mockInvoice);

      const result = await controller.remove('1');

      expect(mockTableService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockInvoice);
    });
  });
});
