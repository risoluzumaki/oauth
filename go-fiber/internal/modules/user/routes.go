package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/risoluzumaki/oauth/go-fiber/internal/middleware"
)

func UserRoute(r fiber.Router, h *Handler) {
	r.Post("auth/login", h.LoginManual)
	r.Post("auth/register", h.RegisterManual)

	r.Get("auth/:provider", h.RiderectGoogle)
	r.Get("auth/:provider/callback", h.CallbackOAuth)

	r.Get("users/profile", middleware.AuthMiddleware, h.GetProfile)
}
