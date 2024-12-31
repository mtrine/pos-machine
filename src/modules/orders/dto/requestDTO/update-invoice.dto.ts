import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from 'src/modules/invoices/dto/requestDTO/create-invoice.dto';


export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
