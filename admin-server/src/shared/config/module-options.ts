// import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configurations from './configurations';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configurations],
};
