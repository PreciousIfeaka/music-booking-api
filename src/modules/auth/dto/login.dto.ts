import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "The user email",
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
  password: string
}