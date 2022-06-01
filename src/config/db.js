const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    mongoose.set("useCreateIndex", true);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error(err.message);
    // Terminate the application
    process.exit(1);
  }
};

module.exports = connectToMongoDB;
