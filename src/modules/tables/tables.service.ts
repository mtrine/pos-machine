import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/requestDTO/create-table.dto';
import { UpdateTableDto } from './dto/requestDTO/update-table.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from './schemas/table.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as QRCode from "qrcode";

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    private configService: ConfigService
  ) {}
  async create(createTableDto: CreateTableDto) {
    const qrUrl = `${this.configService.get<string>('CLIENT_URI')}/table/${createTableDto.tableNumber}`
    const qrCode = await QRCode.toDataURL(qrUrl)
    const createdTable = await this.tableModel.create({
      tableNumber:createTableDto.tableNumber,
      qrCode:qrCode
    })
    return createdTable;
  }

  async findAll() {
    return await this.tableModel.find();
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
