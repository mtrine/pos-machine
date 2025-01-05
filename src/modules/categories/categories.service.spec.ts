import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryModel: Model<Category>

  const mockCategoryModel = {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()

  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = { name: 'Category 1' };
      const mockCreatedCategory = {
        "_id": "6774bef139f0007c943a572a",
        "name": "Category 1'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      };

      mockCategoryModel.create.mockResolvedValue(mockCreatedCategory);

      const result = await service.create(createCategoryDto);

      expect(categoryModel.create).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual(mockCreatedCategory);

    });
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories = [{
        "_id": "6774bef139f0007c943a572a",
        "name": "Category 1'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      }, {
        "_id": "6774bef139f0007c943a572b",
        "name": "Category 2'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      }];
      mockCategoryModel.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(categoryModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    })
  })

  describe('update', () => {
    it('should update a category', async () => {
      const id = '6774bef139f0007c943a572a';
      const updateCategoryDto = { name: 'Category 1' };
      const mockUpdatedCategory = {
        "_id": "6774bef139f0007c943a572a",
        "name": "Category 1'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      };

      mockCategoryModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedCategory);

      const result = await service.update(id, updateCategoryDto);

      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateCategoryDto);
      expect(result).toEqual(mockUpdatedCategory);

    });
  })

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = '6774bef139f0007c943a572a';
      const mockDeletedCategory = {
        "_id": "6774bef139f0007c943a572a",
        "name": "Category 1'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      };

      mockCategoryModel.findByIdAndDelete.mockResolvedValue(mockDeletedCategory);

      const result = await service.remove(id);

      expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockDeletedCategory);

    });
  })
});
