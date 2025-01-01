import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Product {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    imageUrl: string;


    @Prop({
        type: {
            _id: { type: Types.ObjectId, ref: "Category", required: true },
            name: { type: String, required: true },
        },
        required: true,
    })
    category: {
        categoryId: Types.ObjectId;
        name: string;
    };

    @Prop({ default: true })
    availability: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
