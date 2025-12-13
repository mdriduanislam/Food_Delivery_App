const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");
const adminFoodRoutes = require("./routes/adminFoodRoutes");

const app = express();

app.use(express.json());
app.use(cors({origin:true,credentials:true}));
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminFoodRoutes);

app.get('/',(req,res)=>{
    res.send("Api is running...");
});

module.exports =app;