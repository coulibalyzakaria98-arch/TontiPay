const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);

    if (process.env.NODE_ENV === 'development') {
      console.log('Démarrage d\'une base MongoDB en mémoire pour le développement...');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();

      const conn = await mongoose.connect(uri);

      console.log(`MongoDB In-Memory Connected: ${conn.connection.host}`);
      return;
    }

    process.exit(1);
  }
};

module.exports = connectDB;
