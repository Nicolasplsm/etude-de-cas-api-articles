const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const usersService = require("./users.service");
const articlesService = require("./articles.service");

class ArticlesController {
  // Création – user doit être connecté
  async create(req, res, next) {
    try {
      const data = {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status || "draft",
        // id de l'utilisateur connecté
        user: req.user._id,
      };

      const article = await articlesService.create(data);

      // Temps réel : informer les clients
      req.io.emit("article:create", article);

      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  // Mise à jour – réservé aux admins
  async update(req, res, next) {
    try {
      // contrôle du rôle
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const id = req.params.id;
      const data = req.body;

      const article = await articlesService.update(id, data);
      if (!article) {
        throw new NotFoundError();
      }

      req.io.emit("article:update", article);

      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  // Suppression – réservée aux admins
  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const id = req.params.id;
      const deleted = await articlesService.delete(id);

      if (!deleted) {
        throw new NotFoundError();
      }

      req.io.emit("article:delete", { id });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

    async getArticlesByUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const articles = await articlesService.getByUser(userId);
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new ArticlesController();
