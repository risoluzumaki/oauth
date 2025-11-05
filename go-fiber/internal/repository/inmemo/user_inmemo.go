package inmemo

import "github.com/risoluzumaki/oauth/go-fiber/internal/modules/user"

type InMemoryUserRepository struct {
	users map[uint]*user.User
}

func NewInMemoryUserRepository() user.UserRepository {
	return &InMemoryUserRepository{
		users: make(map[uint]*user.User),
	}
}

func (r *InMemoryUserRepository) Create(user *user.User) error {
	r.users[user.Id] = user
	return nil
}

func (r *InMemoryUserRepository) FindById(id uint) (*user.User, error) {
	return r.users[id], nil
}

func (r *InMemoryUserRepository) FindByEmail(email string) (*user.User, error) {
	for _, user := range r.users {
		if user.Email == email {
			return user, nil
		}
	}
	return nil, nil
}

func (r *InMemoryUserRepository) FindByProvider(provider string, providerId string) (*user.User, error) {
	for _, user := range r.users {
		if user.Provider == provider && user.ProviderId == providerId {
			return user, nil
		}
	}
	return nil, nil
}
