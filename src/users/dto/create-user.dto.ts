import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(4)
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string;

    @IsNumber()
    @Min(18, {message: 'Debe ser mayor de edad'})
    @IsNotEmpty()
    age: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    gender: string;
}
