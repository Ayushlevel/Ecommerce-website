require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");
const bcrypt = require("bcryptjs");

console.log("SERVER FILE:", __filename);
console.log("PUBLIC PATH:", path.join(__dirname, "public"));

const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
const PORT = 3000;

/* ---------------- DNS FIX (optional) ---------------- */
dns.setServers(["1.1.1.1", "8.8.8.8"]);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

/* ---------------- TEST ROUTES ---------------- */
app.get("/check", (req, res) => {
  res.send("WORKING");
});

app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

app.get("/whoami", (req, res) => {
  res.send("THIS IS MY SERVER");
});

/* ---------------- USER MODEL ---------------- */
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

const User = mongoose.model("User", userSchema);

/* ---------------- AUTH ROUTES ---------------- */

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "Registration Successful",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (isMatch) {
      res.json({
        message: "Login Successful",
      });
    } else {
      res.json({
        message: "Invalid Email or Password",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- PRODUCT ROUTES ---------------- */

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Get single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Add product
app.post("/api/add-product", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const product = new Product(req.body);

    await product.save();

    console.log("SAVED:", product);

    res.json({
      message: "Product Added"
    });

  } catch (err) {
    console.log("ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

/* ---------------- USERS LIST ---------------- */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


//order route
app.post("/api/orders", async (req, res) => {
console.log("ORDER BODY:", req.body);
    try {

        const {
            userEmail,
            items,
            totalAmount
        } = req.body;

        const order = new Order({

            userEmail,
            items,
            totalAmount

        });

        const savedOrder = await order.save();

        console.log(savedOrder);

      res.json({
        message: "Order placed successfully!",
        order: savedOrder
      });
    } catch (err)
    {

        res.status(500).json({
            error: err.message
        });

    }

});
//view order
app.get("/api/orders", async (req, res) => {

    try {

        const orders =
            await Order.find();

        res.json(orders);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
// email by user
app.get("/api/orders/:email", async (req, res) => {

    try {

        const orders = await Order.find({
            userEmail: req.params.email
        });

        res.json(orders);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

