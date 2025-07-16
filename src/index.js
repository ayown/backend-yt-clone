// require('dotenv').config({path: './.env'}); 
import dotenv from "dotenv";  // Load environment variables from .env file
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env", // Ensure the path to your .env file is correct
});

connectDB();












// ;(async () => {
//   try {
//     await mongoose.connect(
//         `${process.env.MONGODB_URI}/${DB_NAME}`
//     );
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// })();
