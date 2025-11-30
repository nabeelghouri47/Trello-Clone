const { Sequelize } = require("sequelize");
require("dotenv").config();

class Database {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
      }
    );
  }

  connect() {
    return this.sequelize
      .authenticate()
      .then(() => console.log("✅ DB Connected"))
      .catch((err) => console.error("❌ DB Connection Error:", err));
  }
}

module.exports = new Database();
