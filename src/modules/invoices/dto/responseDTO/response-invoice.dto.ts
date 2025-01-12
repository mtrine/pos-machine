import { Expose, Transform, Type } from 'class-transformer';
import { ProductResponseDTO } from 'src/modules/products/dto/responseDTO/response-product.dto';

export class ListOrderResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
}

export class ItemResponseDTO {
  @Expose()
  @Type(()=>ProductResponseDTO)
  product: ProductResponseDTO;

  @Expose()
  quantity: number;

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
