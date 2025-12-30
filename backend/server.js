const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const path = require("path");

const foodRoutes = require("./routes/foodRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stripe", stripeRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

