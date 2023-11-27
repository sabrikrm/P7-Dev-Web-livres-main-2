// Importation du framework Express
const express = require("express");

// Création d'un routeur Express
const router = express.Router();

// Importation des middlewares nécessaires
const auth = require("../middlewares/auth"); // Middleware d'authentification
const multer = require("../middlewares/multer-config"); // Middleware de gestion des fichiers multipart
const sharpConfig = require("../middlewares/sharp-config"); // Middleware de traitement d'images

// Importation du contrôleur pour la gestion des livres
const bookCtrl = require("../controllers/book");

// Définition des routes et des actions associées

// Route pour obtenir la liste de tous les livres
router.get("/", bookCtrl.getAllBooks);

// Route pour obtenir les meilleurs livres en fonction des notes
router.get("/bestrating", bookCtrl.getBestBooks);

// Route pour obtenir un seul livre en fonction de son identifiant
router.get("/:id", bookCtrl.getSingleBook);

// Route pour créer un nouveau livre
router.post("/", auth, multer, sharpConfig, bookCtrl.createBook);

// Route pour noter un livre
router.post("/:id/rating", auth, bookCtrl.rateBook);

// Route pour mettre à jour un livre existant
router.put("/:id", auth, multer, sharpConfig, bookCtrl.updateBook);

// Route pour supprimer un livre
router.delete("/:id", auth, bookCtrl.deleteBook);

// Exportation du routeur pour qu'il puisse être utilisé dans d'autres parties de l'application
module.exports = router;
