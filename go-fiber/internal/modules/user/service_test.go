package user_test

import (
	"testing"

	user "github.com/risoluzumaki/oauth/go-fiber/internal/modules/user"
	"github.com/risoluzumaki/oauth/go-fiber/internal/repository/inmemo"
)

func TestRegisterManual_Success(t *testing.T) {
	// Arrange
	repo := inmemo.NewInMemoryUserRepository()
	service := user.NewUserService(repo)

	username := "testuser"
	name := "Test User"
	email := "test@example.com"
	password := "password"

	// Act
	msg, err := service.RegisterManual(username, name, email, password)

	// Assert
	if err != nil {
		t.Errorf("Expected no error, but got %v", err)
	}

	if msg != "User created successfully" {
		t.Errorf("Expected message 'User created successfully', but got '%s'", msg)
	}

	// Check if user is actually created
	createdUser, _ := repo.FindByEmail(email)
	if createdUser == nil {
		t.Errorf("User was not created in the repository")
	}
}

func TestRegisterManual_EmailExists(t *testing.T) {
	// Arrange
	repo := inmemo.NewInMemoryUserRepository()
	service := user.NewUserService(repo)

	// Pre-existing user
	existingUser := &user.User{
		Id:       1,
		Username: "existinguser",
		Name:     "Existing User",
		Email:    "test@example.com",
		Password: "password",
	}
	repo.Create(existingUser)

	username := "testuser"
	name := "Test User"
	email := "test@example.com"
	password := "password"

	// Act
	msg, err := service.RegisterManual(username, name, email, password)

	// Assert
	if err == nil {
		t.Errorf("Expected an error, but got none")
	}

	expectedError := "Email already exists"
	if err.Error() != expectedError {
		t.Errorf("Expected error message '%s', but got '%s'", expectedError, err.Error())
	}

	if msg != "" {
		t.Errorf("Expected empty message, but got '%s'", msg)
	}
}
