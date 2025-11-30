const { DataTypes } = require("sequelize");
const DB = require("../config/database");
const User = require("./user");

const Board = DB.sequelize.define("Board", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Board);
Board.belongsTo(User);

module.exports = Board;
