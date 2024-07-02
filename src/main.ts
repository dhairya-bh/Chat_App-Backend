import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './user/entities/session.entity';
import { getRepository } from 'typeorm';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepository = getRepository(Session);
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('api');
  const {PORT,COOKIE_SECRET} = process.env;
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  
  app.use(session({
    secret:COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    name: 'CHAT_APP_SESSION_ID',
    cookie: {
      maxAge:3600000 * 24
    },
    store: new TypeormStore().connect(sessionRepository)
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(PORT, () => console.log(`Running on Port : ${PORT}`));
  } catch (error) {
    console.log(error)
  }
  
}
bootstrap();
