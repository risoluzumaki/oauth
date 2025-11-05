package user

import (
	"github.com/gofiber/fiber/v2"
)

func UserRoute(r fiber.Router, h *Handler) {
	r.Post("/login", h.LoginManual)
	r.Post("/register", h.RegisterManual)
}
