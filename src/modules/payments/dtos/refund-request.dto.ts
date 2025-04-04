import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RefundRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  payment_id: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount?: number;
}