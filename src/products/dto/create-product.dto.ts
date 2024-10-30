import { isNotEmpty, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @Min(0)
    stock: number = 0;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    photo: string[];

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    categoryId: number

}
