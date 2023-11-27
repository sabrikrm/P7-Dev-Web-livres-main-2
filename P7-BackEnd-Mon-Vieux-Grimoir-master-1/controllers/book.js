const Book = require("../models/book"); // Importation du modèle de données Book
const fs = require("fs"); // Importation du module File System (fs) pour la gestion des fichiers

// Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find() // Recherche de tous les documents de la collection Book
    .then((books) => res.status(200).json(books)) // Répond avec les livres trouvés au format JSON en cas de succès
    .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en cas d'échec
};

// Récupération d'un seul livre par son ID
exports.getSingleBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche d'un document de la collection Book par son ID
    .then((book) => res.status(200).json(book)) // Répond avec le livre trouvé au format JSON en cas de succès
    .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en cas d'échec
};

// Récupération des meilleurs livres (triés par note moyenne, limités à 3)
exports.getBestBooks = (req, res, next) => {
  Book.find() // Recherche de tous les documents de la collection Book
    .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
    .limit(3) // Limite le résultat à 3 livres
    .then((books) => res.status(200).json(books)) // Répond avec les livres trouvés au format JSON en cas de succès
    .catch((error) => res.status(401).json({ error })); // Répond avec une erreur 401 en cas d'échec
};

// Création d'un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Parse les données JSON de la requête

  delete bookObject._id; // Supprime l'ID existant
  delete bookObject._userId; // Supprime l'ID de l'utilisateur

  const book = new Book({
    ...bookObject, // Copie les données du livre
    userId: req.auth.userId, // Ajoute l'ID de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename.split(".")[0]}.webp`, // Crée l'URL de l'image du livre
    averageRating: bookObject.ratings[0].grade, // Récupère la première note pour la note moyenne
  });

  book
    .save() // Sauvegarde le nouveau livre dans la base de données
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" }); // Répond avec un message de succès
    })
    .catch((error) => {
      res.status(400).json({ error }); // Répond avec une erreur 400 en cas d'échec
    });
};

// Mise à jour d'un livre existant
exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename.split(".")[0]}.webp`,
      }
    : { ...req.body };

  delete bookObject._userId; // Supprime l'ID de l'utilisateur

  Book.findOne({ _id: req.params.id }) // Recherche le livre par son ID
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: Demande non autorisée" }); // Répond avec une erreur 403 si l'utilisateur n'est pas autorisé
      } else if (req.file) {
        const filename = book.imageUrl.split("/images")[1];
        fs.unlink(`images/${filename}`, () => {}); // Supprime l'ancienne image du livre
      }

      Book.updateOne(
        { _id: req.params.id }, // Recherche le livre par son ID
        { ...bookObject, _id: req.params.id } // Met à jour les données du livre
      )
        .then(res.status(200).json({ message: "Livre modifié !" })) // Répond avec un message de succès
        .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en cas d'échec
    })
    .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en cas d'échec
};

// Suppression d'un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche le livre par son ID
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" }); // Répond avec une erreur 401 si l'utilisateur n'est pas autorisé
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id }) // Supprime le livre de la base de données
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" }); // Répond avec un message de succès
            })
            .catch((error) => res.status(401).json({ error })); // Répond avec une erreur 401 en cas d'échec
        });
      }
    })
    .catch((error) => res.status(500).json({ error })); // Répond avec une erreur 500 en cas d'échec
};

// Notation d'un livre par un utilisateur
exports.rateBook = (req, res, next) => {
  const user = req.body.userId;

  if (user !== req.auth.userId) {
    res.status(401).json({ message: "Non autorisé" }); // Répond avec une erreur 401 si l'utilisateur n'est pas autorisé
  } else {
    Book.findOne({ _id: req.params.id }) // Recherche le livre par son ID
      .then((book) => {
        if (book.ratings.find((rating) => rating.userId === user)) {
          res.status(401).json({ message: "Livre déjà noté" }); // Répond avec une erreur 401 si l'utilisateur a déjà noté le livre
        } else {
          // Crée un nouvel objet de notation
          const newRating = {
            userId: user,
            grade: req.body.rating,
            _id: req.body._id,
          };
          const updatedRatings = [...book.ratings, newRating]; // Ajoute newRating au tableau de notations

          // Calcul de la note moyenne
          function calcAverageRating(ratings) {
            const sumRatings = ratings.reduce(
              (total, rate) => total + rate.grade,
              0
            );
            const average = sumRatings / ratings.length;
            return parseFloat(average.toFixed(2)); // Arrondit la note moyenne à 2 décimales
          }

          // Mise à jour du document du livre
          Book.findOneAndUpdate(
            {
              _id: req.params.id,
              "ratings.userId": { $ne: user },
            },
            {
              $push: { ratings: newRating },
              averageRating: calcAverageRating(updatedRatings),
            },
            { new: true }
          )
            .then((updatedBook) => res.status(201).json(updatedBook))
            .catch((error) => res.status(401).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
