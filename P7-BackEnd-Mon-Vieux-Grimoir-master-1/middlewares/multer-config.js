// Importer la bibliothèque multer pour gérer les fichiers téléchargés
const multer = require("multer");

// Définir un objet MIME_TYPES pour mapper les types MIME des images aux extensions de fichier correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

// Configuration du stockage des fichiers téléchargés avec multer
const storage = multer.diskStorage({
  // Définir le dossier de destination où les fichiers téléchargés seront stockés
  destination: (req, file, callback) => {
    callback(null, "images"); // Dans cet exemple, les fichiers seront stockés dans un dossier appelé "images"
  },
  // Définir le nom du fichier lorsqu'il est enregistré sur le serveur
  filename: (req, file, callback) => {
    // Obtenir le nom original du fichier et le remplacer les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    
    // Obtenir l'extension du fichier à partir de son type MIME
    const extension = MIME_TYPES[file.mimetype];
    
    // Construire le nom final du fichier en ajoutant un horodatage unique
    callback(null, name + "_" + Date.now() + "." + extension);
  },
});

// Exporter la configuration de stockage pour être utilisée avec multer
module.exports = multer({ storage: storage });


module.exports = multer({ storage }).single("image");
