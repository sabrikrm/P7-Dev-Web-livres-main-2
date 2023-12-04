const express = require('express');
const server = express();
const port = 4000;
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Charger les variables d'environnement depuis le fichier .env
require("dotenv").config();

// Créer une application Express
const app = express();

// Appliquer des politiques de sécurité du contenu en utilisant le middleware Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'"], // Autoriser le chargement d'images depuis 'self'
    },
  })
);

// Analyser les corps des requêtes au format JSON
app.use(express.json());


server.get('/', (req, res) => {
  res.send('voici la reponse du server');
});

server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);

  const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Cluster72255:T1pRYWBgbUJk@cluster72255.su3sktc.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((err) => console.error('Connexion à MongoDB échouée !', err));





});
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);



module.exports = app;
