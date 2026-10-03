const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/users");
const toysRouter = require("./routes/toys");
const { ToyModel } = require("./models/toyModel");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("public"));

const seedInitialToys = async () => {
  try {
    const count = await ToyModel.countDocuments({});
    if (count === 0) {
      const initialToys = [
        { name: "Lego Star Wars", info: "Lego Star Wars building block toy set for kids", category: "Lego", price: 150, user_id: "system_seed" },
        { name: "Lego Technic Car", info: "Advanced Lego sports car building set", category: "Lego", price: 299, user_id: "system_seed" },
        { name: "Lego City Police", info: "Lego City police station and patrol vehicle set", category: "Lego", price: 120, user_id: "system_seed" },
        { name: "Lego Creator House", info: "3-in-1 Lego creator family house set", category: "Lego", price: 180, user_id: "system_seed" },
        
        { name: "Barbie Dreamhouse", info: "Beautiful Barbie doll house with multiple accessories", category: "Dolls", price: 450, user_id: "system_seed" },
        { name: "Barbie Fashionista", info: "Classic Barbie doll with stylish modern dress", category: "Dolls", price: 59, user_id: "system_seed" },
        { name: "Barbie Ambulance", info: "Barbie medical clinic ambulance vehicle toy set", category: "Dolls", price: 210, user_id: "system_seed" },
        { name: "Princess Mermaid Doll", info: "Colorful mermaid doll for underwater playtime", category: "Dolls", price: 45, user_id: "system_seed" },
        
        { name: "Monopoly Classic", info: "The ultimate real estate trading board game for families", category: "Board Games", price: 95, user_id: "system_seed" },
        { name: "Catan Board Game", info: "Strategy board game of building and trading resources", category: "Board Games", price: 160, user_id: "system_seed" },
        { name: "Carcassonne Game", info: "Medieval tile-placement board game for all ages", category: "Board Games", price: 110, user_id: "system_seed" },
        { name: "Uno Card Game", info: "Fast-paced fun matching card game for family nights", category: "Board Games", price: 25, user_id: "system_seed" }
      ];
      await ToyModel.insertMany(initialToys);
      console.log("Successfully seeded 12 initial toys across 3 categories!");
    }
  } catch (err) {
    console.log("Error seeding toys:", err);
  }
};

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB successfully!");
    await seedInitialToys();
  })
  .catch(err => console.log("MongoDB connection error:", err));

app.use("/users", usersRouter);
app.use("/toys", toysRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
