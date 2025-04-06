import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { CreateArtistProfileDto } from "./dto/create-artist-profile.dto";
import { ApproveArtistProfileDto, UpdateArtisteProfileDto } from "./dto/update-artist-profile.dto";
import { AuthSessionGuard } from "../../guards/auth.guard";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { RoleGuard } from "../../guards/role.guard";
import { Role } from "../users/entities/user";
import { Roles } from "../../decorators/role.decorator";

@ApiBearerAuth()
@Controller("artists")
@UseGuards(AuthSessionGuard, RoleGuard)
export class ArtistController {
  constructor(
    private artistService: ArtistService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArtistProfile(@Body() body: CreateArtistProfileDto) {
    return await this.artistService.createArtistProfile(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of results per page (default: 10)" })
  async getAllArtistsProfiles(@Query("page") page: number, @Query("limit") limit: number) {
    return await this.artistService.getAllArtistProfiles(page ?? 1, limit ?? 10);
  }

  @Get("search")
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results per page (default: 10)' })
  @ApiQuery({ name: 'genre', required: false, type: String, description: 'Music genre' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Location' })
  @ApiQuery({ name: 'price', required: false, type: Number, description: 'Price' })
  async searchForArtists(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("genre") genre?: string,
    @Query("location") location?: string,
    @Query("price") price?: number
  ) {
    return this.artistService.searchForArtist({ genres: genre ? [genre] : [], location, price_per_hour: price }, page || 1, limit || 10)
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getArtistProfileById(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.artistService.getArtistProfileById(id);
  }

  @Put(":id")
  @Roles(Role.ARTIST, Role.ORGANIZER)
  @HttpCode(HttpStatus.OK)
  async updateArtistProfile(@Param("id", new ParseUUIDPipe()) id: string, @Body() body: UpdateArtisteProfileDto) {
    return await this.artistService.updateArtistProfile(id, body);
  }

  @Put(":id/approve")
  @Roles(Role.ADMIN, Role.ORGANIZER)
  @HttpCode(HttpStatus.OK)
  async approveArtistProfile(@Param("id", new ParseUUIDPipe()) id: string, @Body() body: ApproveArtistProfileDto) {
    return this.artistService.approveArtistProfile(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteArtistProfile(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.artistService.deleteArtistProfile(id);
  }
}