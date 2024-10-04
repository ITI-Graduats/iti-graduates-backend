class UserController {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
}

module.exports = UserController;
