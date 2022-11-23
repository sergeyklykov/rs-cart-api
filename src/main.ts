import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import helmet from 'helmet';

import { AppModule } from './app.module';

let serverlessExpressInstance: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.init();

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  const expressApplication = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApplication });
}

export const handler: Handler = async (...args) => {
  serverlessExpressInstance = serverlessExpressInstance ?? await bootstrap();

  return serverlessExpressInstance(...args);
};
