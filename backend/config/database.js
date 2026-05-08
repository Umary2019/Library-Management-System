const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (connectionPromise) {
      return connectionPromise;
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI).then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    });

    return connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error(`Database connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
