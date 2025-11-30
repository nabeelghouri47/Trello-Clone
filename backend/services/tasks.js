// services/tasks.js (Final Corrected Code)

class TasksService {
  constructor({ Task }) {
    this.Task = Task;
  }

  async createTask(listId, title, description) {
    const maxPosition = await this.Task.max("position", { where: { ListId: listId } });
    const position = (maxPosition || 0) + 1000;
    return await this.Task.create({ ListId: listId, title, description, position });
  }

  async updateTask(taskId, data) {
    const task = await this.Task.findByPk(taskId);
    if (!task) throw new Error("Task not found");
    Object.assign(task, data);
    await task.save();
    return task;
  }

  async deleteTask(taskId) {
    const task = await this.Task.findByPk(taskId);
    if (!task) throw new Error("Task not found");
    await task.destroy();
    return { message: "Task deleted" };
  }

  async updateTaskPosition(taskId, newListId, newPosition) {
    const task = await this.Task.findByPk(taskId);
    if (!task) throw new Error("Task not found");
    task.ListId = newListId;
    task.position = newPosition;
    await task.save();
    return task;
  }
}

module.exports = TasksService;