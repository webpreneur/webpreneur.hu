import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  app.enableCors({ origin: 'http://localhost:4200' });
  await app.listen(app.get(ConfigService).getOrThrow<number>('PORT', 1207));
}
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
