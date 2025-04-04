import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistProfile } from "./entities/artist-profile";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistProfile]),
    UserModule,
    JwtModule
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService ]
})
export class ArtistModule {

}