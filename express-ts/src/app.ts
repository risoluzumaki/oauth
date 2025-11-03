import express from 'express'

import { UserRepository } from './modules/user/user.repository';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { UserRoute } from './modules/user/user.route';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthRoute } from './modules/auth/auth.route';
import { ErrMiddleware } from './middleware/err.middleware';

function bootstrap(): void{
  const app = express();
  const router = express.Router();

  app.use(express.json())

  // Logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  })
  
  // WIRING DEPENDENCY
  // ==Sharing 
  const userRepository = new UserRepository();

  // Auth Module
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);
  const authRoute = new AuthRoute(authController);

  // User module
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const userRoute = new UserRoute(userController);

  // ROUTING GROUP
  router.use('/auth', authRoute.router);
  router.use('/user', userRoute.router);

  app.use("/api/v1", router)

  // GLOBAL ERROR HANDLER
  app.use(ErrMiddleware.handleError)

  app.listen(process.env.PORT_APP, () => {
    console.log(`Server is running on port ${process.env.PORT_APP}`);
  })
}

export default bootstrap;