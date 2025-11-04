import { Hono } from 'hono'
import { errMiddleware } from './middleware/err.middleware'
import { authRoute } from './modules/auth/auth.route'
import { userRoute } from './modules/user/user.route'
import { AuthController } from './modules/auth/auth.controller'
import { UserController } from './modules/user/user.controller'
import { AuthService } from './modules/auth/auth.service'
import { UserService } from './modules/user/user.service'
import { UserRepository } from './modules/user/user.repository'
import { authMiddleware } from './middleware/auth.middleware'

export function bootstrap(): Hono {
    const app = new Hono()

    // Repository
    const userRepository = new UserRepository()

    // Service
    const authService = new AuthService(userRepository)
    const userService = new UserService(userRepository)

    // Controller
    const authController = new AuthController(authService)
    const userController = new UserController(userService)

    // Routes
    const api = new Hono()

    authRoute(api, authController)
    
    api.use('/users/*', authMiddleware)
    userRoute(api, userController)

    app.route("/api/v1", api)

    app.onError(errMiddleware)

    return app
}
