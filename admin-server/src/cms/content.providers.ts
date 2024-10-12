import { Content } from './entities/content.mongo.entity';

export const ContentProviders = [
  {
    provide: 'CONTENT_REPOSITORY',
    inject: ['MONGODB_DATA_SOURCE'],
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Content),
  },
];
