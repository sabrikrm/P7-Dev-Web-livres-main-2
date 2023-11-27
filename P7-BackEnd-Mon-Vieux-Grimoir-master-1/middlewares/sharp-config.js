// Importer les bibliothèques "sharp" pour la manipulation d'images et "fs" pour la gestion des fichiers
const sharp = require("sharp");
const fs = require("fs");

// Middleware pour la configuration de Sharp (traitement d'image)
const sharpConfig = async (req, res, next) => {
  // Vérifier si un fichier a été téléchargé dans la requête
  if (!req.file) {
    return next(); // Si aucun fichier n'est présent, passer à l'étape suivante de la chaîne de middleware
  }

  // Extraire le nom de fichier sans extension
  const fileName = req.file.filename.split(".")[0];

  // Construire le nouveau chemin pour le fichier traité au format webp
  const newPath = `${req.file.destination}/${fileName}.webp`;

  try {
    // Utiliser Sharp pour redimensionner l'image en conservant les proportions à 400x500 pixels
    await sharp(req.file.path)
      .resize({
        fit: sharp.fit.contain,
        width: 400,
        height: 500,
      })
      .webp() // Convertir l'image en format webp
      .toFile(newPath); // Enregistrer l'image traitée au nouveau chemin

    // Supprimer le fichier original après traitement
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image originale :", err);
      }
    });

    // Mettre à jour les informations du fichier dans la requête avec le nouveau chemin et nom de fichier
    req.file.path = newPath;
    req.file.filename = `${fileName}.webp`;

    // Passer à l'étape suivante de la chaîne de middleware
    next();
  } catch (error) {
    // En cas d'erreur lors du traitement de l'image, renvoyer une réponse d'erreur 500 (erreur interne du serveur)
    res.status(500).json({ error: "Échec de l'optimisation de l'image" });
  }
};

// Exporter ce middleware pour être utilisé ailleurs
module.exports = sharpConfig;

