const express = require("express");

const BoardsService = require("../services/boards");
const BoardsController = require("../controller/boards");
const authMiddleware = require("../middlewear/authMiddleware");

const Board = require("../models/board");
const List = require("../models/list");
const Task = require("../models/task");

const router = express.Router();

const boardService = new BoardsService({Board, List, Task});
const boardController = new BoardsController(boardService);

router.use(authMiddleware);

router.post("/", boardController.createBoard);
router.get("/", boardController.getBoards);
router.get("/:id/full", boardController.getBoardFull); 
router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);

module.exports = router;
