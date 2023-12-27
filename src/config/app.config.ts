import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import JoiUtil, { JoiConfig } from './utils/joi-util';

export interface IAppConfig {
  port: number;
  name: string;
}

export default registerAs('app', (): IAppConfig => {
  const configs: JoiConfig<IAppConfig> = {
    port: {
      value: parseInt(process.env.APP_PORT, 10) || 3000,
      joi: Joi.number().required(),
    },
    name: {
      value: process.env.APP_NAME || 'Bakery APP',
      joi: Joi.string().required(),
    },
  };
  return JoiUtil.validate(configs);
});
