const User = require('./user');

describe('User', () => {
  let user;

  beforeEach(() => {
    user = new User(1, 'john_doe', 'password123');
  });

  it('should have the correct properties', () => {
    expect(user.id).toBe(1);
    expect(user.username).toBe('john_doe');
    expect(user.password).toBe('password123');
  });

  it('should be able to set new values for properties', () => {
    user.id = 2;
    user.username = 'jane_doe';
    user.password = 'newpassword';

    expect(user.id).toBe(2);
    expect(user.username).toBe('jane_doe');
    expect(user.password).toBe('newpassword');
  });
});