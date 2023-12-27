import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import JoiUtil, { JoiConfig } from './utils/joi-util';
import { LoggingType, parseDatabaseLogging } from './utils/parser';

export interface IDatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: LoggingType;
}

export default registerAs('database', (): IDatabaseConfig => {
  const configs: JoiConfig<IDatabaseConfig> = {
    type: {
      value: 'postgres',
      joi: Joi.string().required(),
    },
    host: {
      value: process.env.DATABASE_HOST,
      joi: Joi.string().required(),
    },
    port: {
      value: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      joi: Joi.number().required(),
    },
    username: {
      value: process.env.DATABASE_USERNAME,
      joi: Joi.string().required(),
    },
    password: {
      value: process.env.DATABASE_PASSWORD,
      joi: Joi.string().required(),
    },
    database: {
      value: process.env.DATABASE_NAME,
      joi: Joi.string().required(),
    },
    // schema: {
    //   value: process.env.DATABASE_SCHEMA || 'bakery_db',
    //   joi: Joi.string().required(),
    // },
    synchronize: {
      value: true,
      joi: Joi.boolean(),
    },
    logging: {
      value: parseDatabaseLogging(process.env.DATABASE_LOGGING) || false,
      joi: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid('all'),
        Joi.array().items(
          Joi.string().valid(
            'query',
            'schema',
            'error',
            'warn',
            'info',
            'log',
            'migration',
          ),
        ),
      ),
    },
  };

  return JoiUtil.validate(configs);
});
