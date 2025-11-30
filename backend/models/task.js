// models/task.js
const { DataTypes } = require("sequelize");
const DB = require("../config/database");
const List = require("./list");

const Task = DB.sequelize.define("Task", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  position: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
});

List.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(List);

module.exports = Task;