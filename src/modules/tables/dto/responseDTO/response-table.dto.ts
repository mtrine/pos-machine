import { Expose, Transform } from "class-transformer";

export class TableResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj._id.toString()) // Chuyển ObjectId thành chuỗi
    _id: string;

    @Expose()
    tableNumber: number;

    @Expose()
    qrCode: string

    @Expose()
    status: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}