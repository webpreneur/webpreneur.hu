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
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = [
        'https://webpreneur.hu',
        'https://www.webpreneur.hu',
      ];

      // Debug: log the origin and environment
      console.log('CORS Origin:', origin, 'NODE_ENV:', process.env.NODE_ENV);

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      // In development OR if NODE_ENV is not set, allow localhost
      if (
        (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') &&
        origin.startsWith('http://localhost:')
      ) {
        callback(null, true);
        return;
      }

      // In production, only allow specific domains
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  await app.listen(app.get(ConfigService).getOrThrow<number>('PORT', 1207));
}
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
