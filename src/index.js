// require('dotenv').config({path: './.env'}); 
import dotenv from "dotenv";  // Load environment variables from .env file

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env", // Ensure the path to your .env file is correct
});

connectDB()  //gives a promise
.then(() => {
  app.on("error", (error) => {
      console.log("Error in server:", error);
      throw error;
    });
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
  });
  
})
.catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});










/*
;(async () => {
  try {
    await mongoose.connect(
        `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    app.on("error", (error) => {
      console.log("Error in server:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
*/