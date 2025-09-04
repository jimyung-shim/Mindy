import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi, { ObjectSchema } from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PersonaController } from './persona/persona.controller';
import { PersonaService } from './persona/persona.service';
//import { McpModule } from '@nestjs-mcp/server';
import { PersonaToolModule } from './persona/tool/persona-tool.module';
import { AgentService } from './agent/agent.service';
import { McpModule } from './mcp/mcp.module';

const envSchema: ObjectSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().allow(''),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_DAYS: Joi.number().integer().min(1).default(7),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(8).default(12),
  PERSONA_ASSIGN_STRATEGY: Joi.string().required(),
});

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60, limit: 30 }]), // 1분 30회
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envSchema,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    McpModule,
    PersonaToolModule,
  ],
  controllers: [PersonaController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    PersonaService,
    AgentService,
  ],
})
export class AppModule {}
