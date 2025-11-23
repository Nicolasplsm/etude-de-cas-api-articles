const express = require("express");
const router = express.Router();

const articlesController = require("./articles.controller");
const authMiddleware = require("../../middlewares/auth");

// L'utilisateur doit être connecté pour ces actions
router.post("/", authMiddleware, (req, res, next) =>
  articlesController.create(req, res, next)
);

router.put("/:id", authMiddleware, (req, res, next) =>
  articlesController.update(req, res, next)
);

router.delete("/:id", authMiddleware, (req, res, next) =>
  articlesController.delete(req, res, next)
);

module.exports = router;
