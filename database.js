const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose || { conn: null, promise: null };

const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGO_URI) throw new Error("MONGO_URI is missing");

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGO_URI, {
        dbName: "weego",
        bufferCommands: false,
      });

    cached.conn = await cached.promise;

    console.log("Database connected successfully");  // Log success message

    return cached.conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
};

module.exports = { connectToDatabase };
