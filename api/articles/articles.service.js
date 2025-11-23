const Article = require("./articles.schema");

class ArticlesService {
  // Création d’un article
  create(data) {
    const article = new Article(data);
    return article.save();
  }

  // Mise à jour d’un article
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  // Suppression d’un article
  delete(id) {
    return Article.findByIdAndDelete(id);
  }

  // récupérer tous les articles d’un user
  getByUser(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticlesService();
