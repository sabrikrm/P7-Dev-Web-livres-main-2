// Importer la bibliothèque "password-validator" pour la validation des mots de passe
const passwordValidator = require("password-validator");

// Créer une instance de schéma de mot de passe
const passwordSchema = new passwordValidator();

// Définir les règles de validation du mot de passe
passwordSchema
  .is()
  .min(8) // Le mot de passe doit avoir au moins 8 caractères
  .has()
  .uppercase() // Le mot de passe doit contenir au moins une lettre majuscule
  .has()
  .lowercase() // Le mot de passe doit contenir au moins une lettre minuscule
  .has()
  .digits() // Le mot de passe doit contenir au moins un chiffre
  .has()
  .not()
  .spaces(); // Le mot de passe ne doit pas contenir d'espaces

// Exporter ce middleware pour la validation du mot de passe
module.exports = (req, res, next) => {
  // Récupérer le mot de passe de l'utilisateur à partir du corps de la requête
  const userPassword = req.body.password;

  // Vérifier si le mot de passe de l'utilisateur respecte les règles définies dans le schéma
  if (!passwordSchema.validate(userPassword)) {
    // Si le mot de passe ne respecte pas les règles, renvoyer une réponse d'erreur 400 (mauvaise demande)
    console.error(
      "Erreur de validation du mot de passe:",
      passwordSchema.validate(userPassword, { list: true })
    );
    
    // Renvoyer un message d'erreur indiquant les règles de validation non respectées
    return res.status(400).json({
      error: `Mot de passe trop faible ${passwordSchema.validate(userPassword, {
        list: true,
      })}`,
    });
  } else {
    // Si le mot de passe est valide, passer à l'étape suivante (middleware suivant) de la chaîne de middleware
    next();
  }
};
module.exports = password-validator;

