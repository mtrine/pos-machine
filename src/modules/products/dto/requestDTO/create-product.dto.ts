import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
        @IsString()
        @IsNotEmpty()
        name: string;
    
        @IsNotEmpty()
        price: number;
    
        @IsString()
        @IsNotEmpty()
        categoryId: string;
    
}
