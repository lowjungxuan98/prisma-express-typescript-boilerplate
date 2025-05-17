import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import conversationRoute from './conversation.route';
import messageRoute from './message.route';
import docsRoute from './docs.route';
import config from '../../config/config';

const router = express.Router();

interface IRoute {
  path: string;
  route: express.Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/conversations',
    route: conversationRoute
  },
  {
    path: '/messages',
    route: messageRoute
  }
];

const devIRoute: IRoute[] = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
