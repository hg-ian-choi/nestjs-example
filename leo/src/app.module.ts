import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PW: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRESIN: Joi.string().required(),
        DOMAIN: Joi.string().required(),
        PATH: Joi.string().required(),
        AT_MAXAGE: Joi.number().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    DatabaseModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
