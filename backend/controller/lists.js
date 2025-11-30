class ListsController {
  constructor(listsService) {
    this.listsService = listsService;
  }

  createList = async (req, res) => {
    try {
      const list = await this.listsService.createList(req.body.boardId, req.body.title);
      res.json({ status: true, data: list });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  getLists = async (req, res) => {
    try {
      const lists = await this.listsService.getLists(req.params.boardId);
      res.json({ status: true, data: lists });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  updateList = async (req, res) => {
    try {
      const list = await this.listsService.updateList(req.params.id, req.body.title);
      res.json({ status: true, data: list });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  deleteList = async (req, res) => {
    try {
      const result = await this.listsService.deleteList(req.params.id);
      res.json({ status: true, data: result });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };

  updateListPosition = async (req, res) => {
    try {
      const list = await this.listsService.updateListPosition(req.params.id, req.body.newPosition);
      res.json({ status: true, data: list });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };
}


module.exports = ListsController