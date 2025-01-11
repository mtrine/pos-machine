import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsArray()
  @IsNotEmpty()
  orderId: string[];

  @IsString()
  note: string;
}
