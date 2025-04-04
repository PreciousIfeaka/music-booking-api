import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { ArtistProfile } from "./entities/artist-profile";
import { CreateArtistProfileDto } from "./dto/create-artist-profile.dto";
import { ApproveArtistProfileDto, UpdateArtisteProfileDto } from "./dto/update-artist-profile.dto";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistProfile)
    private artistRepository: Repository<ArtistProfile>
  ) {}

  async createArtistProfile(payload: CreateArtistProfileDto): Promise<{
    message: string,
    artist: ArtistProfile
  }> {
    const {
      stage_name,
      bio,
      portfolio_urls,
      genres,
      availability,
      price_per_hour
    } = payload;
    const artistProfile = await this.artistRepository.findOne({ 
      where: { stage_name },
    });
    if (artistProfile) throw new ConflictException("Artist profile already exists");

    const artist_profile = this.artistRepository.create({
      stage_name,
      bio,
      portfolio_urls,
      genres,
      availability,
      price_per_hour
    });

    await this.artistRepository.save(artist_profile);

    return {
      message: "Successfully created artist profile",
      artist: artist_profile
    }
  }

  async getAllArtistProfiles(page: number = 1, limit: number = 10): Promise<{
    message: string,
    artists: ArtistProfile[],
    meta: {
      total: number
      current_page: number,
      total_pages: number
    }
  }> {
    const [artists, total] = await this.artistRepository.findAndCount({
      take: limit,
      skip: (page - 1) * 10
    });
    
    return {
      message: "Successfully retrieved all artists profile",
      artists,
      meta: {
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      }
    }
  }

  async getArtistProfileById(id: string): Promise<{
    message: string,
    artist: ArtistProfile
  }> {
    const artist = await this.artistRepository.findOne({ where: { id }});
    if (!artist) throw new NotFoundException("Artist profile not found");

    return {
      message: "Successfully retrieved artist profile",
      artist
    }
  }

  async updateArtistProfile(id: string, payload: UpdateArtisteProfileDto): Promise<{
    message: string,
    artist: ArtistProfile
  }> {
    const { artist }= await this.getArtistProfileById(id);

    await this.artistRepository.update(artist.id, payload);

    const updated_artist = await this.artistRepository.findOne({ where: { id }});

    return {
      message: "Successfully updated artist profile",
      artist: updated_artist
    }
  }

  async searchForArtist(searchOptions: UpdateArtisteProfileDto, page: number = 1, limit: number = 10): Promise<{
    message: string,
    artists: ArtistProfile[],
    meta: {
      total: number,
      current_page: number,
      total_page: number
    }
  }> {
    const { genres, location, price_per_hour } = searchOptions;

    const queryBuilder = this.artistRepository.createQueryBuilder("artist");

    if (price_per_hour) {
      queryBuilder.andWhere("artist.price_per_hour = :price_per_hour", { price_per_hour });
    }

    if (location) {
      queryBuilder.andWhere("artist.location = :location", { location });
    }

    if (genres && genres.length > 0) {
      queryBuilder.andWhere("artist.genres && ARRAY[:...genres]::text[]", { genres });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [artists, total] = await queryBuilder.getManyAndCount();

    return {
      message: "Successfully retrieved searched artists",
      artists,
      meta: {
        total,
        current_page: page,
        total_page: Math.ceil(total / limit)
      }
    }
  }

  async approveArtistProfile(id: string, payload: ApproveArtistProfileDto): Promise<{
    message: string,
    artist: ArtistProfile
  }> {
    const { artist } = await this.getArtistProfileById(id);

    await this.artistRepository.update(id, payload);

    const { artist: updated_artist } = await this.getArtistProfileById(id);

    return {
      message: "Successfully approved an artist's profile",
      artist: updated_artist
    }
  }

  async deleteArtistProfile(id: string): Promise<{ message: string }> {
    const deleted_artist = await this.artistRepository.softDelete(id);
    if (deleted_artist.affected === 0) throw new BadRequestException("Artist profile deletion failed, try again");
    
    return { message: "Successfully deleted artist profile" }
  }
}