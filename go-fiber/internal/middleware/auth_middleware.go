package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/risoluzumaki/oauth/go-fiber/pkg/utils"
)

func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "missing token")
	}

	if len(authHeader) <= 7 || strings.ToLower(authHeader[:7]) != "bearer " {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid token format")
	}
	tokenStr := authHeader[7:]
	claims, err := utils.VerifyToken(tokenStr)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	c.Locals("user_id", claims.UserID)
	c.Locals("email", claims.Email)

	return c.Next()
}
