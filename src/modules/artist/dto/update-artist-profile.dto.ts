import { IsBoolean, IsNotEmpty } from "class-validator";
import { CreateArtistProfileDto } from "./create-artist-profile.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class UpdateArtisteProfileDto extends PartialType(CreateArtistProfileDto) {}

export class ApproveArtistProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_approved: boolean
}