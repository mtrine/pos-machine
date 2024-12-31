import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TablesService } from './tables.service';

import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { TableResponseDTO } from './dto/responseDTO/response-table.dto';
import { CreateTableDto } from './dto/requestDTO/create-table.dto';
import { UpdateTableDto } from './dto/requestDTO/update-table.dto';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ResponseMessage('Table created successfully')
  @Serialize(TableResponseDTO)
  async create(@Body() createTableDto: CreateTableDto) {
    console.log('createTableDto', createTableDto);
    return await this.tablesService.create(createTableDto);
  }

  @Get()
  @ResponseMessage('Tables fetched successfully')
  @Serialize(TableResponseDTO)
  async findAll() {
    return await this.tablesService.findAll();
  }

}
