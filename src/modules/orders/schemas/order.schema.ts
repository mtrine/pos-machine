import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OrderStatus } from "src/enums/oder-status.enum";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({
        type: {
            id: { type: Types.ObjectId, ref: "Table", required: true },
            number: { type: Number, required: true },
        },
        required: true,
    })
    table: {
        id: Types.ObjectId; // ID của bàn (liên kết với collection `tables`)
        number: number; // Số bàn
    }; // Thông tin bàn

    @Prop({
        type: [
            {
                productId: { type: Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        required: true,
    })
    items: {
        productId: Types.ObjectId; // ID món ăn
        quantity: number; // Số lượng món ăn
    }[]; // Danh sách món ăn

    @Prop({ type: Number, required: true })
    totalPrice: number; // Tổng giá tiền

    @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.PREPARING })
    status: OrderStatus;

    @Prop({ type: String, default: "" })
    note: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
