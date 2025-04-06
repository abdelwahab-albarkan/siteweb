require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is working! 🚀");
});

// Modèle Utilisateur
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Modèle Admin
const adminSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

// Route Signup pour les utilisateurs normaux
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Route Login pour les utilisateurs normaux
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Route pour ajouter un admin
app.post("/admin/add", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const newAdmin = new Admin({ username, email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin added successfully!" });
  } catch (error) {
    console.error("Error adding admin: ", error);
    res.status(500).json({ error: "Error adding admin" });
  }
});


app.post("/admin/verify", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Chercher un admin qui correspond aux critères donnés
      const admin = await Admin.findOne({ email, password });
      
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
  
      res.status(200).json({ message: "Admin found", admin });
    } catch (error) {
      res.status(500).json({ error: "Error verifying admin" });
    }
  });
  //////////////////////////




  ////////////////////dashboard ajouter ////
  // Importer Express et MongoDB (déjà configuré)




app.use(express.json()); // Pour lire les JSON dans les requêtes

// Définir le modèle pour `candata`

// Définition du schéma pour les événements




// Assurez-vous que MongoDB est connecté et Express tourne

///////matches ////////////////////////////////////
const dotenv = require('dotenv');
const multer = require('multer');

// Configuration de multer pour stocker les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où l'image sera stockée
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajouter le timestamp pour éviter les conflits
  }
});
const path = require('path');  // Had lline hiya l'initialisation dyal path
const upload = multer({ storage: storage });



const matchSchema = new mongoose.Schema({
  teams: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String } // Le chemin de l'image
});

const Match = mongoose.model('Match', matchSchema);

// Route pour ajouter un match
app.post('/api/matches', upload.single('image'), (req, res) => {
  const { teams, date, time, location, price } = req.body;
  const image = req.file ? req.file.path : null; // Le chemin du fichier image

  const newMatch = new Match({
    teams,
    date,
    time,
    location,
    price,
    image
  });

  newMatch.save()
    .then(match => res.json(match))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route pour récupérer tous les matchs
app.get('/api/matches', (req, res) => {
  Match.find() // Récupère tous les matchs dans MongoDB
    .then(matches => res.json(matches)) // Renvoyer les données
    .catch(err => res.status(400).json('Error: ' + err)); // En cas d'erreur
});

//route pour suprimmer matche
app.delete('/api/matches/:id', async (req, res) => {
  try {
      const matchId = req.params.id;
      await Match.findByIdAndDelete(matchId);
      res.status(200).json({ message: "Match supprimé avec succès" });
  } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression du match" });
  }
});




////////////////////////// music admin //////////////
// Pour permettre de lire les JSON dans les requêtes











// Charger les variables d'environnement
dotenv.config();


// Middleware
app.use(cors());
app.use(express.json());




// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error: " + err));

// Schéma de l'événement
const eventSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  price: Number,
  image: String // Le chemin de l'image
});

const Event = mongoose.model('Event', eventSchema);

// Route pour ajouter un événement
app.post('/api/events', upload.single('image'), (req, res) => {
  const { name, location, date, price } = req.body;
  const image = req.file ? req.file.path : null; // Le chemin du fichier image

  const newEvent = new Event({
    name,
    location,
    date,
    price,
    image
  });

  newEvent.save()
    .then(event => res.json(event))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET Endpoint bach tjib data
app.get('/api/events', (req, res) => {
    Event.find() // Kayqra mn MongoDB
      .then(events => res.json(events)) // Radd data
      .catch(err => res.status(400).json('Error: ' + err)); // F chi 7ala fiha error
  });

// delete events music
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Event.findByIdAndDelete(id);
      res.json({ message: "Événement supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  });
  
  
  



const fs = require('fs');

// Check if uploads exists, idha ma kanash, dirna
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




