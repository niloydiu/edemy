require('pg');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const express = require('express');

let server;

async function bootstrap() {
  if (!server) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new (require('@nestjs/platform-express').ExpressAdapter)(expressApp)
    );
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.init();
    server = expressApp;
  }
  return server;
}

module.exports = async (req, res) => {
  const appInstance = await bootstrap();
  appInstance(req, res);
};
