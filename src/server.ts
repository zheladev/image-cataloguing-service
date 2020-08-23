import 'reflect-metadata';
import App from './app';
import * as bodyParser from 'body-parser';
import PostsController from './posts/post.controller';
import errorMiddleware from './middleware/error.middleware';
import loggerMiddleware from './middleware/routeLogger.middleware';
import cookieParser = require('cookie-parser');
import AuthenticationController from './authentication/authentication.controller';
import config from './typeorm-config';
import { createConnection } from 'typeorm';
import TagController from './controllers/tag.controller';



(async () => {
  try {
    await createConnection(config);
} catch(error){
    console.log('Error while connecting to the database', error);
    return error;
}
  const app = new App(
    [
      new TagController(),
    ],
    [
      bodyParser.json(),
      loggerMiddleware,
      errorMiddleware,
      cookieParser(),
    ],
    3000,
  );
  app.listen();
})();
