const express = require("express");

const ListsService = require("../services/lists");
const ListsController = require("../controller/lists");
const authMiddleware = require("../middlewear/authMiddleware");

const List = require("../models/list");
const Task = require("../models/task");

const router = express.Router();
const listService = new ListsService({List, Task});
const listController = new ListsController(listService);

router.use(authMiddleware);

router.post("/", listController.createList);
router.get("/:boardId", listController.getLists);
router.put("/:id", listController.updateList);
router.put("/:id/move", listController.updateListPosition);
router.delete("/:id", listController.deleteList);

module.exports = router;
