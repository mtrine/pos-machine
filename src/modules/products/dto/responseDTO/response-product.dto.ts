import { Expose, Transform, Type } from "class-transformer";
import { CategoryResponseDTO } from "src/modules/categories/dto/responseDTO/response-category.dto";

export class ProductResponseDTO {

    @Expose()
    @Transform(({ obj }) => obj._id.toString()) // Chuyển ObjectId thành chuỗi
    _id: string;

    @Expose()
    name: string;

    @Expose()
    price: number;

    @Expose()
    imageUrl: string;

    @Expose()
    @Type(() => CategoryResponseDTO)
    category: CategoryResponseDTO ;
    
    @Expose()
    availability: boolean;
}