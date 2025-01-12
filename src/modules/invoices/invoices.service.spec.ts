// import { Test, TestingModule } from '@nestjs/testing';
// import { InvoicesService } from './invoices.service';
// import { Model } from 'mongoose';
// import { Invoice } from './schemas/invoice.schema';
// import { Order } from '../orders/schemas/order.schema';
// import { Product } from '../products/schemas/product.schema';
// import { find } from 'rxjs';
// import { getModelToken } from '@nestjs/mongoose';
// import { NotFoundException } from '@nestjs/common';

// describe('InvoicesService', () => {
//   let service: InvoicesService;
//   let invoiceModel: Model<Invoice>;
//   let orderModel: Model<Order>;
//   let productModel: Model<Product>;

//   const mockInvoiceModel = {
//     create: jest.fn(),
//     find: jest.fn(),
//     findById: jest.fn(),
//     findByIdAndUpdate: jest.fn(),
//     findByIdAndDelete: jest.fn(),
//   };

//   const mockOrderModel = {
//     find: jest.fn(),
//   };

//   const mockProductModel = {
//     findById: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         InvoicesService,
//         {
//           provide: getModelToken(Invoice.name),
//           useValue: mockInvoiceModel,
//         },
//         {
//           provide: getModelToken(Order.name),
//           useValue: mockOrderModel,
//         },
//         {
//           provide: getModelToken(Product.name),
//           useValue: mockProductModel,
//         },
//       ],
//     }).compile();

//     service = module.get<InvoicesService>(InvoicesService);
//     invoiceModel = module.get<Model<Invoice>>(getModelToken(Invoice.name));
//     orderModel = module.get<Model<Order>>(getModelToken(Order.name));
//     productModel = module.get<Model<Product>>(getModelToken(Product.name));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create an invoice', async () => {
//       const createInvoiceDto = { orderId: ['orderId1'], note: 'Test unit' };
//       const mockOrder = {
//         _id: 'orderId1',
//         product: [{ _id: 'productId1', quantity: 1 }],
//       };
//       const mockProduct = { _id: 'productId1', name: 'Product 1', price: 100 };
//       const mockItems = [
//         {
//           productId: 'productId1',
//           name: 'Product 1',
//           price: 100,
//           quantity: 1,
//           totalPrice: 100,
//         },
//       ];
//       const mockCreatedInvoice = {
//         orderIds: ['orderId1'],
//         items: mockItems,
//         totalPrice: 100,
//         note: 'Test unit',
//       };

//       jest.spyOn(orderModel, 'find').mockResolvedValue([mockOrder]);
//       jest.spyOn(productModel, 'findById').mockResolvedValue(mockProduct);
//       mockInvoiceModel.create.mockResolvedValue(mockCreatedInvoice);

//       const result = await service.create(createInvoiceDto);

//       expect(orderModel.find).toHaveBeenCalledWith({
//         _id: { $in: createInvoiceDto.orderId },
//       });
//       expect(productModel.findById).toHaveBeenCalledWith(
//         mockOrder.product[0]._id,
//       );
//       expect(mockInvoiceModel.create).toHaveBeenCalledWith({
//         orderIds: createInvoiceDto.orderId,
//         items: mockItems,
//         totalPrice: 100,
//         note: 'Test unit',
//       });
//       expect(result).toEqual(mockCreatedInvoice);
//     });
//   });

//   describe('findAll', () => {
//     it('should return all invoices', async () => {
//       const mockInvoices = [
//         { _id: 'invoiceId1', note: 'test' },
//         { _id: 'invoiceId2', note: 'test' },
//       ];

//       mockInvoiceModel.find.mockResolvedValue(mockInvoices);

//       const result = await service.findAll();

//       expect(mockInvoiceModel.find).toHaveBeenCalled();
//       expect(result).toEqual(mockInvoices);
//     });
//   });

//   describe('findOne', () => {
//     it('should return an invoice', async () => {
//       const invoiceId = 'invoiceId1';
//       const mockInvoice = { _id: 'invoiceId1', note: 'test' };

//       mockInvoiceModel.findById.mockResolvedValue(mockInvoice);

//       const result = await service.findOne(invoiceId);

//       expect(mockInvoiceModel.findById).toHaveBeenCalledWith(invoiceId);
//       expect(result).toEqual(mockInvoice);
//     });

//     it('should throw an error if invoice not found', async () => {
//       const invoiceId = 'invoiceId1';

//       mockInvoiceModel.findById.mockResolvedValue(null);

//       await expect(service.findOne(invoiceId)).rejects.toThrowError(
//         'Invoice not found',
//       );
//     });
//   });

//   describe('update', () => {
//     it('should update an invoice', async () => {
//       const invoiceId = 'invoiceId1';
//       const updateInvoiceDto = {
//         orderId: ['orderId1'],
//         note: 'Test unit update',
//       };
//       const mockInvoice = {
//         _id: 'invoiceId1',
//         orderId: ['orderId1'],
//         items: [
//           {
//             productId: 'productId1',
//             name: 'Product 1',
//             price: 100,
//             quantity: 1,
//             totalPrice: 100,
//           },
//         ],
//         totalPrice: 100,
//         note: 'Test unit',
//       };
//       const mockOrder = {
//         _id: 'orderId1',
//         product: [{ _id: 'productId1', quantity: 1 }],
//       };
//       const mockProduct = { _id: 'productId1', name: 'Product 1', price: 100 };
//       const mockItems = [
//         {
//           productId: 'productId1',
//           name: 'Product 1',
//           price: 100,
//           quantity: 1,
//           totalPrice: 100,
//         },
//       ];
//       const mockUpdatedInvoice = {
//         _id: 'invoiceId1',
//         orderId: ['orderId1'],
//         items: mockItems,
//         totalPrice: 100,
//         note: 'Test unit update',
//       };

//       mockInvoiceModel.findById.mockResolvedValue(mockInvoice);
//       jest.spyOn(orderModel, 'find').mockResolvedValue([mockOrder]);
//       jest.spyOn(productModel, 'findById').mockResolvedValue(mockProduct);
//       mockInvoiceModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedInvoice);

//       const result = await service.update(invoiceId, updateInvoiceDto);

//       // expect(mockInvoiceModel.findById).toHaveBeenCalledWith(invoiceId);
//       expect(orderModel.find).toHaveBeenCalledWith({
//         _id: { $in: updateInvoiceDto.orderId },
//       });
//       expect(productModel.findById).toHaveBeenCalledWith(
//         mockOrder.product[0]._id,
//       );
//       expect(mockInvoiceModel.findByIdAndUpdate).toHaveBeenCalledWith(
//         invoiceId,
//         {
//           orderId: updateInvoiceDto.orderId,
//           items: mockItems,
//           totalPrice: 100,
//           note: 'Test unit update',
//         },
//       );
//       expect(result).toEqual(mockUpdatedInvoice);
//     });
//     it('should throw NotFoundException if invoice not found', async () => {
//       const updateInvoiceDto = { orderId: ['orderId1'], note: 'Updated note' };

//       mockInvoiceModel.findById.mockResolvedValue(null);

//       await expect(
//         service.update('invoiceId1', updateInvoiceDto),
//       ).rejects.toThrowError('Invoice not found');
//     });
//   });

//   describe('remove', () => {
//     it('should delete an invoice', async () => {
//       const invoiceId = 'invoiceId1';
//       const mockInvoice = { _id: 'invoiceId1', note: 'test' };

//       mockInvoiceModel.findByIdAndDelete.mockResolvedValue(mockInvoice);

//       const result = await service.remove(invoiceId);

//       expect(mockInvoiceModel.findByIdAndDelete).toHaveBeenCalledWith(
//         invoiceId,
//       );
//       expect(result).toEqual(mockInvoice);
//     });

//     it('should throw an error if invoice not found', async () => {
//       const invoiceId = 'invoiceId1';

//       mockInvoiceModel.findByIdAndDelete.mockResolvedValue(null);

//       await expect(service.remove(invoiceId)).rejects.toThrowError(
//         'Invoice not found',
//       );
//     });
//   });
// });
