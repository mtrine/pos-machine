import { IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { TableStatus } from "src/enums/table-status.enum";

export class CreateTableDto {
        @IsNumber()
        @IsNotEmpty()
        tableNumber: number;    
}
