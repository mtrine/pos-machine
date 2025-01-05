import { Test, TestingModule } from '@nestjs/testing';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

describe('TablesController', () => {
  let controller: TablesController;
  let service: TablesService;

  const mockTableService = {
    create: jest.fn(),
    findAll: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [
        {
          provide: TablesService,
          useValue: mockTableService
        }
      ],
    }).compile();

    controller = module.get<TablesController>(TablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a table', async () => {
      const createTableDto = { tableNumber: 1 };
      const mockQrCode = 'data:image/png;base64,...';
      const mockCreatedTable = { tableNumber: 1, qrCode: mockQrCode };

      mockTableService.create.mockResolvedValue(mockCreatedTable);

      const result = await controller.create(createTableDto);

      expect(mockTableService.create).toHaveBeenCalledWith(createTableDto);
      expect(result).toEqual(mockCreatedTable);

    });
  })

  describe('findAll', () => {
    it('should return an array of tables', async () => {
      const mockTables = [{ tableNumber: 1 }, { tableNumber: 2 }];
      mockTableService.findAll.mockResolvedValue(mockTables);

      const result = await controller.findAll();

      expect(mockTableService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTables);
    })
  })
});
