import { Test, TestingModule } from '@nestjs/testing';
import { TablesService } from './tables.service';
import { Table } from './schemas/table.schema';
import { Model } from 'mongoose';
import { find } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { getModelToken } from '@nestjs/mongoose';

describe('TablesService', () => {
  let service: TablesService;
  let tableModel: Model<Table>
  let configService: ConfigService


  const mockTableModel = {
    find: jest.fn(),
    create: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        {
          provide: getModelToken(Table.name),
          useValue: mockTableModel
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
    tableModel = module.get<Model<Table>>(getModelToken(Table.name));
    configService = module.get<ConfigService>(ConfigService)

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a table with QR code', async () => {
      const createTableDto = { tableNumber: 1 };
      const mockQrCode = 'data:image/png;base64,...';
      const mockCreatedTable = { tableNumber: 1, qrCode: mockQrCode };

      jest.spyOn(configService, 'get').mockReturnValue('http://localhost:3000');
      jest.spyOn(QRCode, 'toDataURL').mockResolvedValue(mockQrCode);
      mockTableModel.create.mockResolvedValue(mockCreatedTable);

      const result = await service.create(createTableDto);

      expect(configService.get).toHaveBeenCalledWith('CLIENT_URI');
      expect(QRCode.toDataURL).toHaveBeenCalledWith('http://localhost:3000/table/1');
      expect(mockTableModel.create).toHaveBeenCalledWith({
        tableNumber: 1,
        qrCode: mockQrCode,
      });
      expect(result).toEqual(mockCreatedTable);
    });
  });

  describe('findAll', () => {
    it('should return all tables', async () => {
      const mockTables = [
        { tableNumber: 1, qrCode: 'data:image/png;base64,...' },
        { tableNumber: 2, qrCode: 'data:image/png;base64,...' },
      ];
      mockTableModel.find.mockResolvedValue(mockTables);

      const result = await service.findAll();

      expect(mockTableModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockTables);
    });
  });

  // describe('remove', () => {
  //   it('should return a remove message', () => {
  //     const id = 1;
  //     const result = service.remove(id);

  //     expect(result).toBe(`This action removes a #${id} table`);
  //   });
  // });
});
