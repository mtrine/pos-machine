import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


@Schema({ timestamps: true })
export class Invoice {
    @Prop({ type: Types.ObjectId, ref: "Order", required: true })
    orderId: Types.ObjectId; // ID của đơn hàng liên kết

    @Prop({
        type: [
            {
                productId: { type: Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
                totalPrice: { type: Number, required: true },
            },
        ],
        required: true,
    })
    items: {
        productId: Types.ObjectId; // ID món ăn
        name: string; // Tên món ăn
        price: number; // Giá một đơn vị
        quantity: number; // Số lượng
        totalPrice: number; // Giá = price * quantity
    }[];

    @Prop({ type: Number, required: true })
    totalPrice: number; // Tổng giá tiền của hóa đơn

    @Prop({ type: String })
    note?: string; // Ghi chú cho hóa đơn (nếu có)
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
