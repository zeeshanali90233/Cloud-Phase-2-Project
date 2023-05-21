import mongoose from "mongoose";


export const connectDB=(handler)=>async(req,res)=>{
    if(mongoose.connections[0].readyState){
        return handler(req,res);
    }
    mongoose.connect(process.env.MONGO_URI);
    return handler(req,res);
}