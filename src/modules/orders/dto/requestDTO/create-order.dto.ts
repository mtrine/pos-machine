import { IsArray, IsNotEmpty, IsNumber, IsMongoId, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";


class ItemDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: string;

    note: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {

    @IsMongoId()
    @IsNotEmpty()
    tableId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    items: ItemDto[];

    @IsNumber()
    @Min(0)
    totalPrice: number;

}
