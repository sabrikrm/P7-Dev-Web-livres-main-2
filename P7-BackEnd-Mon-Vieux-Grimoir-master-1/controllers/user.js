const bcrypt = require("bcrypt"); // Importation de la bibliothèque de hachage bcrypt
const jwt = require("jsonwebtoken"); // Importation de la bibliothèque JSON Web Token

const User = require("../models/user"); // Importation du modèle User

// Fonction de création de compte (signup)
exports.signup = (req, res, next) => {
  console.log(req);
  bcrypt
    .hash(req.body.password, 10) // Hachage du mot de passe reçu dans la requête avec un coût de 10
    .then((hash) => {
      // Création d'une nouvelle instance de l'utilisateur avec email et mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Sauvegarde de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de connexion (login)
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de données par son email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "donnés login/ mot de passe incorrect!" });
      }

      // Comparaison du mot de passe reçu dans la requête avec le mot de passe haché enregistré
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "donnés login / mot de passe incorrect !" });
          }

          // Si les identifiants sont valides, création d'un jeton (token) JWT pour l'authentification
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
              expiresIn: "2h", // Durée de validité du token (2 heures)
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
