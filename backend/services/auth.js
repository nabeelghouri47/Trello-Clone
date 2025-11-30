const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor(User) {
    this.User = User;
  }

  async signup({ username, email, password }) {
    const existing = await this.User.findOne({ where: { email }});
    if (existing) throw new Error("Email already exists");

    const hash = await bcrypt.hash(password, 10);

    return await this.User.create({ username, email, password: hash });
  }

  async login(email, password) {
    const user = await this.User.findOne({ where: { email }});
    if (!user) throw new Error("Email not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Wrong password");

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1d" });

    return { user, token };
  }
}

module.exports = AuthService;
