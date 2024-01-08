// Importation des modules nécessaires
const bcrypt = require('bcrypt'); // Utilisé pour hasher les mots de passe
const jwt = require('jsonwebtoken'); // Utilisé pour créer des tokens signés JWT
const validator = require('validator'); // Utilisé pour valider les données d'entrée comme les e-mails

// Importation du modèle User qui représente la structure de données pour les utilisateurs dans la base de données
const User = require('../models/User');

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    const email = req.body.email;
    // Utilisation de validator pour vérifier que l'e-mail est dans un format valide
    if (!validator.isEmail(email)) {
        // Si l'e-mail n'est pas valide, renvoie une réponse 400 avec un message d'erreur
        return res.status(400).json({ message: 'Adresse e-mail invalide' });
    }

    // Hashage du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10) // Le nombre 10 représente le "salt round" pour le hashage
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'e-mail et le mot de passe hashé
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          // Si la sauvegarde réussit, renvoie une réponse 201 avec un message de succès
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          // En cas d'erreur lors de la sauvegarde, renvoie une réponse 400 avec l'erreur
          .catch(error => res.status(400).json({ error }));
      })
      // En cas d'erreur lors du hashage, renvoie une réponse 500 avec l'erreur
      .catch(error => res.status(500).json({ error }));
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur par e-mail dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si aucun utilisateur n'est trouvé, renvoie une réponse 401 avec un message d'erreur
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            // Si un utilisateur est trouvé, compare le mot de passe fourni avec le hash enregistré
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si la comparaison est fausse, renvoie une réponse 401 avec un message d'erreur
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si la comparaison est vraie, renvoie une réponse 200 avec l'ID de l'utilisateur et un JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET", // Clé secrète pour le JWT, 
                            { expiresIn: '24h'} // Le token expire après 24 heures
                        )
                    });
                })
                // En cas d'erreur lors de la comparaison, renvoie une réponse 500 avec l'erreur
                .catch(error => res.status(500).json({ error }));
        })
        // En cas d'erreur lors de la recherche de l'utilisateur, renvoie une réponse 500 avec l'erreur
        .catch(error => res.status(500).json({ error }));
};
