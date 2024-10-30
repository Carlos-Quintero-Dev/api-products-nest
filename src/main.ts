import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger("Main")

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }))

  const configService = new ConfigService()

  await app.listen(configService.get("PORT"));

  logger.log(`Server running on port ${configService.get("PORT")}`)
  logger.log(`Server running on url ${await app.getUrl()}`)
}
bootstrap();
