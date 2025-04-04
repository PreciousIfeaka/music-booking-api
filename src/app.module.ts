import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dataSource from './database/data-source';
import { ArtistModule } from './modules/artist/artist.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/events/event.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payments/payment.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import GlobalExceptionsFilter from './filters/global-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: () => Promise.resolve(dataSource)
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("AUTH_SECRET"),
        signOptions: { expiresIn: configService.get<string>("JWT_EXPIRY") }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    ArtistModule,
    EventModule,
    BookingModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
       new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
       }),
     },
    AppService
  ]
})
export class AppModule {}