package user

import (
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/risoluzumaki/oauth/go-fiber/pkg/common"
	"github.com/risoluzumaki/oauth/go-fiber/pkg/utils"
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

func (uh *Handler) RiderectGoogle(ctx *fiber.Ctx) error {
	provider := ctx.Params("provider")
	if provider != "google" {
		return common.NewAppError(400, "Invalid provider")
	}

	clientId := os.Getenv("GOOGLE_CLIENT_ID")
	redirectUri := os.Getenv("GOOGLE_CALLBACK_URL")
	scope := "email profile"

	redirectURL := "https://accounts.google.com/o/oauth2/v2/auth" +
		"?client_id=" + clientId +
		"&redirect_uri=" + redirectUri +
		"&response_type=code" +
		"&scope=" + scope

	return ctx.Redirect(redirectURL, fiber.StatusFound)
}

func (uh *Handler) CallbackOAuth(ctx *fiber.Ctx) error {
	code := ctx.Query("code")
	if code == "" {
		return common.NewAppError(400, "Code not found")
	}
	token, err := utils.GetTokenProvider(code)
	if err != nil {
		return err
	}
	userInfo, err := utils.GetProviderInfo(token)
	if err != nil {
		return err
	}
	tokenApp, err := uh.service.HandleOAuth(userInfo.Name, userInfo.Sub, userInfo.Email)

	return ctx.Status(200).JSON(fiber.Map{
		"token": tokenApp,
	})
}

func (uh *Handler) GetProfile(ctx *fiber.Ctx) error {
	id := ctx.Locals("user_id").(uint)
	email := ctx.Locals("email").(string)
	user, err := uh.service.Profile(id, email)
	if err != nil {
		return err
	}
	userResponse := &ProfileResponse{
		ID:       user.Id,
		Username: user.Username,
		Name:     user.Name,
		Email:    user.Email,
	}
	return ctx.Status(200).JSON(userResponse)
}
