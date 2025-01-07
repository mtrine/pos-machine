import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{
        provide: ProductsService,
        useValue: mockProductsService
      }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the created product', async () => {
      const createProductDto = {
        name: 'product',
        price: 1000,
        categoryId: 'category_id'
      }
      const file = {
        fieldname: 'file',
        originalname: 'file.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: '',
        filename: 'file.jpg',
        size: 1024,
        stream: null,
        path: 'path/to/file.jpg',
        buffer: Buffer.from(''),
      }
      const mockProduct = {
        _id: 'product_id',
        ...createProductDto
      }

      mockProductsService.create.mockResolvedValue(mockProduct);
      expect(await controller.create(file, createProductDto)).toEqual(mockProduct);

    })
  })

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          _id: 'product_id',
          name: 'product',
          price: 1000,
          categoryId: 'category_id'
        }
      ]
      mockProductsService.findAll.mockResolvedValue(mockProducts);
      expect(await controller.findAll()).toEqual(mockProducts);
    })
  });

  describe('update', () => {
    it('should return the updated product', async () => {
      const updateProductDto = {
        name: 'product',
        price: 1000,
        categoryId: 'category_id',
        imageUrl: ''
      }
      const file = {
        fieldname: 'file',
        originalname: 'file.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: '',
        filename: 'file.jpg',
        size: 1024,
        stream: null,
        path: 'path/to/file.jpg',
        buffer: Buffer.from(''),
      }

      const mockProduct = {
        _id: 'product_id',
        ...updateProductDto
      }

      mockProductsService.update.mockResolvedValue(mockProduct);
      expect(await controller.update(file, 'product_id', updateProductDto)).toEqual(mockProduct);

    })

    describe('remove', () => {
      it('should return the removed product', async () => {
        const mockProduct = {
          _id: 'product_id',
          name: 'product',
          price: 1000,
          categoryId: 'category_id'
        }
        mockProductsService.remove.mockResolvedValue(mockProduct);
        expect(await controller.remove('product_id')).toEqual(mockProduct)
      });
    });
  })
});
