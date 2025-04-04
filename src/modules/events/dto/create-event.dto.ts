import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @ApiProperty({
    description: "The name of the event"
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "The description of the event"
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "The budget of the event in USD"
  })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiProperty({
    description: "The muscic genres required for the event"
  })
  @IsArray()
  @IsOptional()
  required_genres?: string[]

  @ApiProperty({
    description: "The start date of the event"
  })
  @IsDateString()
  @IsOptional()
  event_date?: Date;

  @ApiProperty({
    description: "The location of the event"
  })
  @IsString()
  @IsOptional()
  location?: string;
}