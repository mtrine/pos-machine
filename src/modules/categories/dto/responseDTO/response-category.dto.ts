import { Expose, Transform } from "class-transformer";
import { Types } from "mongoose";

export class CategoryResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj._id.toString()) // Chuyển ObjectId thành chuỗi
    _id: string;

    @Expose()
    name: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
