import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { create } from 'domain';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoryService
        }
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockCategoryService.create.mockResolvedValue(mockCreatedCategory);

      const result = await controller.create(createCategoryDto);

      expect(mockCategoryService.create).toHaveBeenCalledWith(createCategoryDto);
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
      }];
      mockCategoryService.findAll.mockResolvedValue(mockCategories);

      const result = await controller.findAll();

      expect(mockCategoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    })
  })

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto = { name: 'Category 1' };
      const mockUpdatedCategory = {
        "_id": "6774bef139f0007c943a572a",
        "name": "Category 1'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      };

      mockCategoryService.update.mockResolvedValue(mockUpdatedCategory);

      const result = await controller.update('6774bef139f0007c943a572a', updateCategoryDto);

      expect(mockCategoryService.update).toHaveBeenCalledWith('6774bef139f0007c943a572a', updateCategoryDto);
      expect(result).toEqual(mockUpdatedCategory);

    });
  })

  describe('remove', () => {
    it('should remove a category', async () => {
      const mockRemovedCategory = {
        "_id": "6774bef139f0007c943a572a",
        "name": "Category 1'",
        "createdAt": "2025-01-01T04:05:05.780Z",
        "updatedAt": "2025-01-01T04:05:05.780Z"
      };

      mockCategoryService.remove.mockResolvedValue(mockRemovedCategory);

      const result = await controller.remove('6774bef139f0007c943a572a');

      expect(mockCategoryService.remove).toHaveBeenCalledWith('6774bef139f0007c943a572a');
      expect(result).toEqual(mockRemovedCategory);

    });
  })
});
