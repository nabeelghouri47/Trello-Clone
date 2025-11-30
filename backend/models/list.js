// models/list.js
const { DataTypes } = require("sequelize");
const DB = require("../config/database");
const Board = require("./board");

const List = DB.sequelize.define("List", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, 
});

Board.hasMany(List, { onDelete: 'CASCADE' });
List.belongsTo(Board);

module.exports = List;