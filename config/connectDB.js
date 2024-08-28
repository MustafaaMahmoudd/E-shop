const mongoose = require("mongoose");

// const DB = process.env.DB.replace("<password>", process.env.DATA_BASE_PASSWORD);
const DB = process.env.DB.replace("<password>", process.env.DATA_BASE_PASSWORD);
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(DB);
    console.log(`DataBase connected successfully ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error is ${error.message}`);
    process.exit(1);
  }
};

module.exports=connectDB;