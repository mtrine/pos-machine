import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Invoice {
    @Prop({ type: [{ type: Types.ObjectId, ref: "Order", required: true }] })
    orderIds: Types.ObjectId[]; // ID của các đơn hàng liên kết

    @Prop({
        type: [
            {
                product: { type: Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                totalPrice: { type: Number, required: true },
            },
        ],
        required: true,
    })
    items: {
        product: Types.ObjectId; // ID món ăn
        quantity: number; // Số lượng
        totalPrice: number; // Giá = price * quantity
    }[];

    @Prop({ type: Number, required: true })
    totalPrice: number; // Tổng giá tiền của hóa đơn

    @Prop({ type: String })
    note?: string; // Ghi chú cho hóa đơn (nếu có)
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.path('items').schema.set('_id', false);
