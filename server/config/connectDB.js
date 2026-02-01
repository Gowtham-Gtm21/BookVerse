const mongoose =require("mongoose");


const connectDB =()=>{
    try{
     mongoose.connect(process.env.MONGO_URI)
     .then(()=>{console.log("connected to db");
     })
     .catch((error)=>{
        console.log(error.message);
        
     })
    }catch(error){
         throw Error("connection error");
    }
}

module.exports=connectDB;