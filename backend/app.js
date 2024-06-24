const express =require("express");
const app = express();
const cors=require("cors");
app.use(express.json());
require("dotenv").config();
require("./connection/connection.js")
const User=require("./routes/user.js")
const Books=require("./routes/book.js")
const favourite=require("./routes/favourite.js")
const cart=require("./routes/cart.js")
const Order=require("./routes/order.js")

app.use(cors());
//routes
app.use("/api",User);
app.use("/api",Books);
app.use("/api",favourite);
app.use("/api",cart);
app.use("/api",Order);
//creating Port
app.listen(process.env.PORT, ()=>{
    console.log(`Server Started at port ${process.env.PORT}`);
})