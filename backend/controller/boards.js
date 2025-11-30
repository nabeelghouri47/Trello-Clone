class BoardsController {
  constructor(boardsService) {
    this.boardsService = boardsService;
  }

  createBoard = async (req, res) => {
    try {
      const board = await this.boardsService.createBoard(req.user.id, req.body.title);
      res.json({ status: true, data: board });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  getBoards = async (req, res) => {
    try {
      const boards = await this.boardsService.getBoards(req.user.id);
      res.json({ status: true, data: boards });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  getBoardFull = async (req, res) => {
    try {
      const board = await this.boardsService.getBoardFull(req.params.id, req.user.id);
      res.json({ status: true, data: board });
    } catch (err) {
      res.status(404).json({ status: false, message: err.message });
    }
  };

  updateBoard = async (req, res) => {
    try {
      const board = await this.boardsService.updateBoard(req.params.id, req.body.title);
      res.json({ status: true, data: board });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  deleteBoard = async (req, res) => {
    try {
      const result = await this.boardsService.deleteBoard(req.params.id);
      res.json({ status: true, data: result });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };
}


module.exports = BoardsController