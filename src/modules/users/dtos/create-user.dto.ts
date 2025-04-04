import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "../entities/user";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "The name of the user",
    example: "Young sholly"
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "The user's email",
    example: "email@example.com"
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    example: "String@1234"
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: "The type of account to be opened",
    example: "Admin"
  })
  @IsEnum(Role)
  account_type: Role;

  @ApiProperty({
    description: "The avatar url of the user",
    example: "https://cloudinary/image1.webp"
  })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}