

const http = require("http");
const app = require("./app"); //créer un serveur web le module http en fonction du contenu de votre module app. 

// Normaliser et valider le numéro de port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Analyser la valeur du port en tant qu'entier

  if (isNaN(port)) {
    return val; // Renvoyer la valeur d'origine si ce n'est pas un nombre
  }
  if (port >= 0) {
    return port; // Renvoyer le port s'il s'agit d'un nombre valide
  }
  return false; // Renvoyer false pour les valeurs de port non valides
};

const port = normalizePort(process.env.PORT || "4300"); // Obtenir le port à partir des variables d'environnement ou utiliser 4300 par défaut
app.set("port", port); // Définir le port dans l'application Express

// Gestionnaire d'erreurs pour les erreurs de démarrage du serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error; // Lancer une erreur si l'erreur n'est pas liée à l'écoute
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? `pipe ${address}` : `port : ${port}`; // ecrire cponcatrnacion avec le +

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} nécessite des privilèges élevés.`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} est déjà utilisé.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // Créer un serveur HTTP en utilisant l'application Express

server.on("error", errorHandler); // Gérer les erreurs lors du démarrage du serveur
server.on("listening", () => {
  const address = server.address();
  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${port}`;
  console.log(`Écoute sur ${bind}`); // Enregistrer un message lorsque le serveur est en écoute
});

server.listen(port); // Démarrer le serveur et écouter sur le port spécifié
