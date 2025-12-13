const dotenv = require("dotenv");
dotenv.config();

const app = require('./app');

const connectDB = require('./config/db');

const path = require("path");

const foodRoutes = require("./routes/foodRoutes");

const cartRoutes = require("./routes/cartRoutes");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/foods", foodRoutes);

app.use("/api/cart", cartRoutes);
