const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors({origin:true,credentials:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Api is running...");
});

module.exports =app;