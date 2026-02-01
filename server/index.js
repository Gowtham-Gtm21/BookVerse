// module import

require("dotenv").config();
const express =require("express");
const connectDB=require("./config/connectDB");
const cookieParser =require("cookie-parser");
const cors =require("cors")
const bookRoutes=require("./Routes/bookRoute");
const userRoutes =require("./Routes/userRoute");
const cartRoutes =require("./Routes/cartRoute");
const orderRoutes=require("./Routes/orderRoute");
const adminRoutes=require("./Routes/adminRoute");

// app
const app=express();

// midddleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173' 
}));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));


//routing
app.use("/book",bookRoutes);
app.use("/user",userRoutes);
app.use("/cart",cartRoutes);
app.use("/order",orderRoutes);
app.use("/admin",adminRoutes)


//db connection
connectDB();

//port 
app.listen(process.env.PORT || 8080,()=>{
    console.log("http://localhost:8080");
    
})

