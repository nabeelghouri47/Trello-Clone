const express = require("express");

const TasksService = require("../services/tasks");
const TasksController = require("../controller/task");
const authMiddleware = require("../middlewear/authMiddleware");

const Task = require("../models/task");

const router = express.Router();

const taskService = new TasksService({Task});
const taskController = new TasksController(taskService);

router.use(authMiddleware);

router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.put("/:id/move", taskController.updateTaskPosition); 
router.delete("/:id", taskController.deleteTask);

module.exports = router;