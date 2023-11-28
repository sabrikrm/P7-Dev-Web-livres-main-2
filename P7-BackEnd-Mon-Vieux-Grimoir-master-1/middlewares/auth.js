// Importer la bibliothèque jsonwebtoken pour gérer les jetons JWT
const jwt = require("jsonwebtoken");


// Exporter ce middleware comme une fonction qui sera utilisée pour vérifier les jetons d'authentification
module.exports = (req, res, next) => {
  try {
    // Récupérer le jeton JWT de l'en-tête "Authorization" de la requête
    const token = req.headers.authorization.split(" ")[1];

    // Vérifier le jeton en utilisant la clé secrète stockée dans une variable d'environnement (process.env.TOKEN)
    const decodedToken = jwt.verify(token, process.env.TOKEN);

    // Extraire l'ID de l'utilisateur à partir du jeton décodé
    const { userId } = decodedToken;

    // Ajouter l'ID de l'utilisateur à l'objet "auth" de la requête pour qu'il soit disponible pour les autres middlewares
    req.auth = {
      userId,
    };

    // Passer à l'étape suivante (middleware suivant) de la chaîne de middleware
    next();
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur 401 (non autorisé) avec l'erreur en tant que JSON
    res.status(401).json({ error });
  }
};



