package user

import (
	"github.com/risoluzumaki/oauth/go-fiber/pkg/common"
	"github.com/risoluzumaki/oauth/go-fiber/pkg/utils"
)

type Service struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *Service {
	return &Service{
		repo: repo,
	}
}

func (us *Service) RegisterManual(username string, name string, email string, password string) (string, error) {
	existing, _ := us.repo.FindByEmail(email)
	if existing != nil {
		return "", common.NewAppError(400, "Email already exists")
	}
	user := &User{
		Username: username,
		Name:     name,
		Email:    email,
		Password: password,
	}
	err := us.repo.Create(user)
	if err != nil {
		return "", common.NewAppError(500, "Internal Server Error")
	}
	return "User created successfully", nil

}

func (us *Service) LoginManual(email string, password string) (string, error) {
	user, err := us.repo.FindByEmail(email)
	if err != nil {
		return "", common.NewAppError(500, "Internal Server Error")
	}
	if user == nil {
		return "", common.NewAppError(404, "User not found")
	}
	if user.Password != password {
		return "", common.NewAppError(401, "Invalid password")
	}
	token, err := utils.GenerateToken(user.Id, user.Email)
	if err != nil {
		return "", err
	}
	return token, nil
}

func HandleOauth() {}

func Profile() {}
