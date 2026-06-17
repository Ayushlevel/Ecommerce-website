require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
console.log("SERVER FILE:", __filename);
console.log("PUBLIC PATH:", path.join(__dirname, "public"));
const dns = require("dns");

const Product = require("./models/Product");

const app = express();
const PORT = 3000;

/* ---------------- DNS FIX (optional) ---------------- */
dns.setServers(["1.1.1.1", "8.8.8.8"]);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

// Serve frontend (IMPORTANT FIX)
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

/* ---------------- TEST ROUTE ---------------- */
app.get("/check", (req, res) => {
  res.send("WORKING");
});

/* ---------------- USER MODEL ---------------- */
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

/* ---------------- AUTH ROUTES ---------------- */
app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.json({ message: "Registration Successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ message: "Login Successful" });
  } else {
    res.json({ message: "Invalid Email or Password" });
  }
});

/* ---------------- PRODUCT ROUTES ---------------- */

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- ADD PRODUCT ---------------- */
app.post("/api/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.json({ message: "Product Added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- EXTRA ROUTES ---------------- */
app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

app.get("/whoami", (req, res) => {
  res.send("THIS IS MY SERVER");
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});