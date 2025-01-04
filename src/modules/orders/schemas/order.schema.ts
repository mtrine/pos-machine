import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OrderStatus } from "src/enums/oder-status.enum";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({
        type: {
            _id: { type: Types.ObjectId, ref: "Table", required: true },
            tableNumber: { type: Number, required: true },
        },
        required: true,
    })
    table: {
        _id: Types.ObjectId; // ID của bàn (liên kết với collection `tables`)
        tableNumber: number; // Số bàn
    }; // Thông tin bàn

    @Prop({
        type: [
            {
                _id: { type: Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                note: { type: String, default: "" },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        required: true,
    })
    product: {
        _id: Types.ObjectId; // ID món ăn
        name: string; // Tên món ăn
        note: string; // Ghi chú món ăn
        quantity: number; // Số lượng món ăn
    }[]; // Danh sách món ăn

    @Prop({ type: Number, required: true })
    totalPrice: number; // Tổng giá tiền

    @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.PREPARING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
