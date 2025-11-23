const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    // récupération du token (tu utilises x-access-token)
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "Token manquant";
    }

    // vérification du token
    const decoded = jwt.verify(token, config.secretJwtToken);

    // decoded contient : { userId, iat, exp }
    // on doit maintenant récupérer l'utilisateur complet
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw "Utilisateur introuvable";
    }

    // on attache l'utilisateur complet à req.user
    req.user = user;

    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
