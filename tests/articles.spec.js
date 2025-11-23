const request = require("supertest");
const mockingoose = require("mockingoose");
const jwt = require("jsonwebtoken");

const { app } = require("../server");
const config = require("../config");
const Article = require("../api/articles/articles.schema");
const User = require("../api/users/users.model");

describe("API Articles (création, mise à jour, suppression)", () => {
  const fakeUserId = "507f191e810c19729de860ea";

  const adminUser = {
    _id: fakeUserId,
    name: "Admin",
    email: "admin@test.com",
    password: "hashedpassword",
    role: "admin",
  };

  let token;

  beforeEach(() => {
    // reset des mocks
    mockingoose.resetAll();

    // le middleware d'auth utilise User.findById
    // findById est mappé en interne sur l'opération 'findOne'
    mockingoose(User).toReturn(adminUser, "findOne");

    // on génère un token valide comme dans login()
    token = jwt.sign({ userId: fakeUserId }, config.secretJwtToken, {
      expiresIn: "3d",
    });
  });

  it("POST /api/articles doit créer un article et retourner 201", () => {
    const fakeArticle = {
      _id: "60f718df4f1a25630c4f1a23",
      title: "Mon article",
      content: "Contenu de test",
      status: "draft",
      user: fakeUserId,
    };

    // on mock la sauvegarde Mongoose
    mockingoose(Article).toReturn(fakeArticle, "save");

    return request(app)
      .post("/api/articles")
      .set("x-access-token", token)
      .send({
        title: "Mon article",
        content: "Contenu de test",
      })
      .expect(201); // vérifie le code HTTP
  });

  it("PUT /api/articles/:id doit mettre à jour un article et retourner 200 pour un admin", () => {
    const articleId = "60f718df4f1a25630c4f1a23";

    const updatedArticle = {
      _id: articleId,
      title: "Titre modifié",
      content: "Nouveau contenu",
      status: "published",
      user: fakeUserId,
    };

    // findByIdAndUpdate -> opération interne 'findOneAndUpdate'
    mockingoose(Article).toReturn(updatedArticle, "findOneAndUpdate");

    return request(app)
      .put(`/api/articles/${articleId}`)
      .set("x-access-token", token)
      .send({
        title: "Titre modifié",
        content: "Nouveau contenu",
        status: "published",
      })
      .expect(200); // vérifie le code HTTP
  });

  it("DELETE /api/articles/:id doit supprimer un article et retourner 204 pour un admin", () => {
    const articleId = "60f718df4f1a25630c4f1a23";

    const deletedArticle = {
      _id: articleId,
      title: "Ancien article",
      content: "Contenu",
      status: "draft",
      user: fakeUserId,
    };

    // findByIdAndDelete -> opération interne 'findOneAndDelete'
    mockingoose(Article).toReturn(deletedArticle, "findOneAndDelete");

    return request(app)
      .delete(`/api/articles/${articleId}`)
      .set("x-access-token", token)
      .expect(204); // vérifie le code HTTP
  });
});
