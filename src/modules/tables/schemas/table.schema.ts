import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TableStatus } from "src/enums/table-status.enum";

@Schema({ timestamps: true })
export class Table {
    @Prop({ required: true, unique: true })
    tableNumber: number;

    @Prop({ required: true, unique: true })
    qrCode: string;

    @Prop({ type: String, enum: Object.values(TableStatus), default: TableStatus.FREE })
    status: TableStatus; 

}

export const TableSchema = SchemaFactory.createForClass(Table);
