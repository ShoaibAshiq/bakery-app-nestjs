import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurations } from './config';
import { dbConfigFactory } from './db-config-factory';

import modules from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [...configurations], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfigFactory,
      inject: [ConfigService],
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
