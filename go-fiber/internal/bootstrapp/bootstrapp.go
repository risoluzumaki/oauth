package bootstrapp

import (
	"errors"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/risoluzumaki/oauth/go-fiber/internal/modules/user"
	"github.com/risoluzumaki/oauth/go-fiber/internal/repository/inmemo"
	"github.com/risoluzumaki/oauth/go-fiber/pkg/common"
)

// fiber

func Bootstrapp() {
	godotenv.Load()
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			// Defualt Err
			code := fiber.StatusInternalServerError
			message := "Internal Server Error"

			// Custom Err
			var appErr *common.AppError
			if ok := errors.As(err, &appErr); ok {
				code = appErr.Code
				message = appErr.Msg
			}

			// Fiber err
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
				message = e.Message
			}

			return c.Status(code).JSON(fiber.Map{
				"code":    code,
				"message": message,
			})
		},
	})

	// GLOBAL MIDDLEWARE
	app.Use(cors.New(
		cors.Config{
			AllowOrigins: "*",
			AllowHeaders: "*",
		},
	))
	app.Use(logger.New())
	app.Use(recover.New())

	// WIRING DEPEND
	db := inmemo.NewInMemoryUserRepository()
	service := user.NewUserService(db)
	handler := user.NewHandler(*service)

	// ROUTING GROUPING
	api := app.Group("/api/v1")
	user.UserRoute(api.Group("/auth"), handler)

	app.Listen(":" + os.Getenv("PORT_APP"))
}
