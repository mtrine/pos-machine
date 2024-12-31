import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { MongoExceptionFilter } from './exception-handler/mongo-exception.filter';
import { HttpExceptionFilter } from './exception-handler/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new MongoExceptionFilter());
  app.setGlobalPrefix('/api/');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
