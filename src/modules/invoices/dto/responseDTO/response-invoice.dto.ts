import { Expose, Transform, Type } from 'class-transformer';

export class ListOrderResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
}

export class ItemResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  price: string;

  @Expose()
  totalPrice: string;
}
export class InvoiceResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  @Type(() => ListOrderResponseDto)
  orderIds: ListOrderResponseDto[];

  @Expose()
  @Type(() => ItemResponseDTO)
  items: ItemResponseDTO[];

  @Expose()
  totalPrice: number;

  @Expose()
  note?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
