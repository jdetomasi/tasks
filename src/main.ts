import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validator will strip validated (returned) object of any properties that do not use any validation decorators
      forbidUnknownValues: false, // if true attempts to validate unknown objects fail immediately.
      validationError: {
        target: false, // target should not be exposed in ValidationError
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
