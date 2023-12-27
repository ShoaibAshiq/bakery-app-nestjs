import {
  INestApplication,
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

export const setUpValidation = (app: INestApplication): void => {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
};

export const setupSerialization = (app: INestApplication): void => {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
};

export const setupApp = async (app: INestApplication): Promise<void> => {
  const config = app.get<ConfigService>(ConfigService);
  const logger = new Logger('AppBoostrap');

  setUpValidation(app);
  // setupSerialization(app);

  const port = config.get<number>('app.port');
  logger.log(`Runing on port ${port}`);
  await app.listen(port);
};
