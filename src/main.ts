import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger("Bootstrap");

  app.setGlobalPrefix("/api");

  const options = new DocumentBuilder()
    .setTitle('Music Booking API')
    .setDescription('API Doc for Music Booking API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);
  app.use('api/docs.json', (req: Request, res: Response) => {
    (res as any).json(document);
  });

  const port = app.get<ConfigService>(ConfigService).get<number>("PORT");
  await app.listen(process.env.PORT ?? 3000);
  logger.log("Server listening on port", port);
}
bootstrap();
