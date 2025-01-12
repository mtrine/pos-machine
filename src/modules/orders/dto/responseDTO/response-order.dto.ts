import { Expose, Transform, Type } from "class-transformer";
import { ProductResponseDTO } from "src/modules/products/dto/responseDTO/response-product.dto";
import { TableResponseDTO } from "src/modules/tables/dto/responseDTO/response-table.dto";


export class ItemResponseDTO {
    @Expose()
    @Type(() => ProductResponseDTO)
    product: ProductResponseDTO;

    @Expose()
    name: string;

    @Expose()
    note: string;

    @Expose()
    quantity: number;
}

export class OrderResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj._id.toString()) 
    _id: string;

    @Expose()
    @Type(() => TableResponseDTO)
    table:TableResponseDTO;

    @Expose()
    @Type(() => ItemResponseDTO)
    products:ItemResponseDTO[];

    @Expose()
    totalPrice: number;

    @Expose()
    status: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}