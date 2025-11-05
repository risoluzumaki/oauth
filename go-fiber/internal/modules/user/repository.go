package user

type UserRepository interface {
	Create(user *User) error
	FindById(id uint) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByProvider(providerId string) (*User, error)
}
