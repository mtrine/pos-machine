import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/requestDTO/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/requestDTO/update-invoice.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { InvoiceResponseDto } from './dto/responseDTO/response-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ResponseMessage('Invoice created successfully')
  // @Serialize(InvoiceResponseDto)
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @ResponseMessage('Invoice list fetched successfully')
  @Serialize(InvoiceResponseDto)
  async findAll() {
    return await this.invoicesService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Invoice list fetched successfully')
  @Serialize(InvoiceResponseDto)
  async findOne(@Param('id') id: string) {
    return await this.invoicesService.findOne(id);
  }

  // @Patch(':id')
  // @ResponseMessage('Invoice updated successfully')
  // @Serialize(InvoiceResponseDto)
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateInvoiceDto: UpdateInvoiceDto,
  // ) {
  //   return await this.invoicesService.update(id, updateInvoiceDto);
  // }

  @Delete(':id')
  @ResponseMessage('Invoice delete successfully')
  @Serialize(InvoiceResponseDto)
  async remove(@Param('id') id: string) {
    return await this.invoicesService.remove(id);
  }
}
