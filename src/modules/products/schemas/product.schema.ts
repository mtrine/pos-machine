import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Product {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    imageUrl: string;


    @Prop({
        type: Types.ObjectId,
        ref: "Category",
        required: true,
    })
    category: Types.ObjectId;

    @Prop({ default: true })
    availability: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
