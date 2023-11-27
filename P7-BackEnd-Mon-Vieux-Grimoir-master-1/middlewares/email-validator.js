// Middleware de validation de l'adresse e-mail
const emailValidator = (req, res, next) => {
  // Récupérer l'adresse e-mail à partir du corps de la requête
  const { email } = req.body; 

  // Définir une expression régulière (regex) pour valider l'adresse e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Vérifier si l'adresse e-mail est manquante ou ne correspond pas à la regex
  if (!email || !email.match(emailRegex)) {
    // Si l'adresse e-mail est invalide, renvoyer une réponse d'erreur 400 (mauvaise demande)
    return res.status(400).json({ error: "Adresse mail invalide" });
  }

  // Si l'adresse e-mail est valide, passer à l'étape suivante (middleware suivant) de la chaîne de middleware
  return next();
};

// Exporter ce middleware pour qu'il puisse être utilisé ailleurs
module.exports = emailValidator;
