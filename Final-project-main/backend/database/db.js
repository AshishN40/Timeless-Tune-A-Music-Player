import mongoose from "mongoose";

const connectDb = async() =>{
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("Using MongoDB URI:", process.env.MONGO_URL ? "URI is set (not showing for security)" : "URI is NOT set");
        
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"Timeless-Tune",
            // Add options for connection retry and timeouts
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.log("MongoDB connection error:");
        console.log(error);
        
        if (error.name === 'MongooseServerSelectionError') {
            console.log("\nPossible reasons for connection failure:");
            console.log("1. Your IP address may not be whitelisted in MongoDB Atlas");
            console.log("2. MongoDB Atlas username or password might be incorrect");
            console.log("3. Network connectivity issues");
            console.log("\nTo fix IP whitelisting:");
            console.log("- Go to MongoDB Atlas dashboard");
            console.log("- Select your cluster");
            console.log("- Go to Network Access");
            console.log("- Add your current IP address or use 0.0.0.0/0 for development (not recommended for production)");
        }
    };
};
export default connectDb;