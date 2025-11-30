// services/boards.js (Final Corrected Code)
const { Op } = require("sequelize");

class BoardsService {
  constructor({ Board, List, Task }) {
    this.Board = Board;
    this.List = List;
    this.Task = Task;
  }

  async createBoard(userId, title) {
    return await this.Board.create({ title, UserId: userId });
  }

  async getBoards(userId) {
    return await this.Board.findAll({
      where: { UserId: userId },
      attributes: ["id", "title"],
    });
  }

  async getBoardFull(boardId, userId) {
    const board = await this.Board.findOne({
      where: { id: boardId, UserId: userId },
      attributes: ["id", "title"],
      include: [
        {
          model: this.List,
          attributes: ["id", "title", "position"],
          include: [
            {
              model: this.Task,
              attributes: ["id", "title", "description", "completed", "position"],
            },
          ],
        },
      ],
      // 🛑 FIX: Yahan Lists aur Tasks ka order set kiya gaya hai.
      order: [
        [this.List, 'position', 'ASC'], // Lists ko unki position se sort karein
        [this.List, this.Task, 'position', 'ASC'] // Har List ke Tasks ko unki position se sort karein
      ]
    });
    if (!board) throw new Error("Board not found or unauthorized");
    return board;
  }

  async updateBoard(boardId, title) {
    const board = await this.Board.findByPk(boardId);
    if (!board) throw new Error("Board not found");
    board.title = title;
    await board.save();
    return board;
  }

  async deleteBoard(boardId) {
    const board = await this.Board.findByPk(boardId);
    if (!board) throw new Error("Board not found");
    await board.destroy();
    return { message: "Board deleted" };
  }
}

module.exports = BoardsService;