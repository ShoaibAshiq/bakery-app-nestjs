import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfigFactory = async (configService: ConfigService) => ({
  type: configService.get<TypeOrmModuleOptions>('database.type', {
    infer: true, // We also need to infer the type of the database.type variable to make userFactory happy
  }),
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.database'),
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: configService.get<boolean>('database.synchronize'),
  logging: configService.get<boolean>('database.logging'),
});
