// services/lists.js (Final Corrected Code)

class ListsService {
  constructor({ List, Task }) {
    this.List = List;
    this.Task = Task;
  }

  async createList(boardId, title) {
    const maxPosition = await this.List.max("position", { where: { BoardId: boardId } });
    const position = (maxPosition || 0) + 1000;
    return await this.List.create({ title, BoardId: boardId, position });
  }

  async getLists(boardId) {
    return await this.List.findAll({
      where: { BoardId: boardId },
      include: [this.Task],
      order: [["position", "ASC"]],
    });
  }

  async updateList(listId, title) {
    const list = await this.List.findByPk(listId);
    if (!list) throw new Error("List not found");
    list.title = title;
    await list.save();
    return list;
  }

  async deleteList(listId) {
    const list = await this.List.findByPk(listId);
    if (!list) throw new Error("List not found");
    await list.destroy();
    return { message: "List deleted" };
  }

  async updateListPosition(listId, newPosition) {
    const list = await this.List.findByPk(listId);
    if (!list) throw new Error("List not found");
    list.position = newPosition;
    await list.save();
    return list;
  }
}

module.exports = ListsService;