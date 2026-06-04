const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.patch("/:id/toggle", taskController.toggleTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
