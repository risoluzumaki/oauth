package user

import (
	"strings"

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
		Provider: "MANUAL",
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

func (us *Service) HandleOAuth(name string, providerId string, email string) (string, error) {
	googleProvider := "GOOGLE"
	user, err := us.repo.FindByProvider(providerId)
	if err != nil {
		return "", common.NewAppError(500, "Internal Server Error")
	}

	if user != nil {
		token, err := utils.GenerateToken(user.Id, user.Email)
		if err != nil {
			return "", err
		}
		return token, nil
	}

	createUserName := strings.Split(email, "@")[0]
	newUser := &User{
		Username:   createUserName,
		Name:       name,
		Email:      email,
		Provider:   googleProvider,
		ProviderId: providerId,
	}

	err = us.repo.Create(newUser)
	if err != nil {
		return "", common.NewAppError(500, "Something error when create user")
	}

	token, err := utils.GenerateToken(newUser.Id, newUser.Email)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (us *Service) Profile(id uint, email string) (*User, error) {
	user, err := us.repo.FindById(id)
	if err != nil {
		return nil, common.NewAppError(404, "User not found")
	}
	return user, nil
}
