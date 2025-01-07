import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<Product>
  let categoryModel: Model<Category>
  let cloudinaryService: CloudinaryService

  const mockProductModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }

  const mockCategoryModel = {
    findById: jest.fn()
  }

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService
        },

      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const product = {
        name: 'Product 1',
        price: 100,
        categoryId: 'category-id'
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
      const createdProduct = {
        _id: 'product-id',
        ...product
      }
      mockCategoryModel.findById.mockResolvedValueOnce({
        _id: 'category-id'
      })
      mockProductModel.create.mockResolvedValueOnce(createdProduct as any)
      mockCloudinaryService.uploadFile.mockResolvedValueOnce({
        secure_url: 'https://cloudinary.com/file.jpg'
      })
      const result = await service.create(file, product)

      expect(result).toEqual(createdProduct)
      expect(mockCategoryModel.findById).toHaveBeenCalledWith('category-id')
      expect(mockProductModel.create).toHaveBeenCalledWith({
        ...product,
        category: { _id: 'category-id' },
        imageUrl: 'https://cloudinary.com/file.jpg'
      })
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [
        {
          _id: 'product-id-1',
          name: 'Product 1',
          price: 100,
          imageUrl: 'https://cloudinary.com/file.jpg'
        },
        {
          _id: 'product-id-2',
          name: 'Product 2',
          price: 200,
          imageUrl: 'https://cloudinary.com/file.jpg'
        }
      ]
      mockProductModel.find.mockResolvedValueOnce(products as any)
      const result = await service.findAll()

      expect(result).toEqual(products)
      expect(mockProductModel.find).toHaveBeenCalled()
    })
  });

  describe('update', () => {
    it('should update a product', async () => {
      const product = {
        name: 'Product 1',
        price: 100,
        categoryId: 'category-id',
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

      const updatedProduct = {
        _id: 'product-id',
        ...product
      }

      mockProductModel.findById.mockResolvedValueOnce(updatedProduct as any)
      mockCategoryModel.findById.mockResolvedValueOnce({
        _id: 'category-id'
      })
      mockProductModel.findByIdAndUpdate.mockResolvedValueOnce(updatedProduct as any)
      mockCloudinaryService.uploadFile.mockResolvedValueOnce({
        secure_url: 'https://cloudinary.com/file.jpg'
      })
      const result = await service.update('product-id', file, product)

      expect(result).toEqual(updatedProduct)
      expect(mockProductModel.findById).toHaveBeenCalledWith('product-id')
      expect(mockCategoryModel.findById).toHaveBeenCalledWith('category-id')

    })
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = {
        _id: 'product-id',
        name: 'Product 1',
        price: 100,
        imageUrl: 'https://cloudinary.com/file.jpg', // Đường dẫn ảnh cũ
      };
  
      // Mock dữ liệu trả về từ findByIdAndDelete
      mockProductModel.findByIdAndDelete.mockResolvedValueOnce(product as any);
  
      // Mock kết quả deleteFile
      mockCloudinaryService.deleteFile.mockResolvedValueOnce({ result: 'ok' });
  
      // Gọi hàm remove
      const result = await service.remove('product-id');
  
      // Kiểm tra kết quả trả về
      expect(result).toEqual(product);
  
      // Kiểm tra các hàm mock được gọi với tham số đúng
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith('product-id');
      
      
    });
  });
  
});
