// controller/task.js
class TasksController {
  constructor(tasksService) {
    this.tasksService = tasksService;
  }

  createTask = async (req, res) => {
    try {
      const task = await this.tasksService.createTask(req.body.listId, req.body.title, req.body.description);
      res.json({ status: true, data: task });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  updateTask = async (req, res) => {
    try {
      const task = await this.tasksService.updateTask(req.params.id, req.body);
      res.json({ status: true, data: task });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  deleteTask = async (req, res) => {
    try {
      const result = await this.tasksService.deleteTask(req.params.id);
      res.json({ status: true, data: result });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  updateTaskPosition = async (req, res) => {
    try {
      const { newListId, newPosition } = req.body;
      // req.params.id is the taskId
      const task = await this.tasksService.updateTaskPosition(req.params.id, newListId, newPosition);
      res.json({ status: true, data: task });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };
}

module.exports = TasksController