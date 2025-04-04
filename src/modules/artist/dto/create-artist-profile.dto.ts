import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateArtistProfileDto {
  @ApiProperty({
    description: "The stage name of the artist",
    example: "Young sholly"
  })
  @IsNotEmpty()
  @IsString()
  stage_name: string;

  @ApiProperty({
    description: "The bio of the artist",
    example: "An Afro musician"
  })
  @IsString()
  bio: string;

  @ApiProperty({
    description: "The genre of music sung by the artist",
    example: ["Juju", "Highlife"]
  })
  @IsArray()
  genres: string[];

  @ApiProperty({
    description: "The portfolio of the artist",
    example: ["wwww.wwww.w", "www.www.www"]
  })
  @IsArray()
  @IsOptional()
  portfolio_urls?: string[];

  @ApiProperty({
    description: "The availability of the artist"
  })
  @IsString()
  @IsOptional()
  availability?: string;

  @ApiProperty({
    description: "The price per hour of the artist",
    example: 500
  })
  @IsNumber()
  @IsOptional()
  price_per_hour?: number;

  @ApiProperty({
    description: "The base location of the artist"
  })
  @IsString()
  location: string
}