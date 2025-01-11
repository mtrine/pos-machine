import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateInvoiceDto } from 'src/modules/invoices/dto/requestDTO/create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsArray()
  @IsNotEmpty()
  orderId: string[];

  @IsString()
  note: string;
}
