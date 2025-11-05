package user

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/risoluzumaki/oauth/go-fiber/pkg/common"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (uh *Handler) RegisterManual(ctx *fiber.Ctx) error {
	var req RegisterRequest
	if err := ctx.BodyParser(&req); err != nil {
		return err
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return common.NewAppError(400, "Bad Request")
	}

	msg, err := uh.service.RegisterManual(req.Username, req.Name, req.Email, req.Password)
	if err != nil {
		return err
	}
	return ctx.Status(201).JSON(fiber.Map{
		"message": msg,
	})
}

func (uh *Handler) LoginManual(ctx *fiber.Ctx) error {
	var req LoginRequest
	if err := ctx.BodyParser(&req); err != nil {
		return err
	}
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return common.NewAppError(400, "Bad Request")
	}
	token, err := uh.service.LoginManual(req.Email, req.Password)
	if err != nil {
		return err
	}
	return ctx.Status(200).JSON(fiber.Map{
		"token": token,
	})
}
