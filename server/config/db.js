const mongoose = require('mongoose');

// Cache the connection so serverless invocations (Vercel) reuse it instead of reconnecting every request
const cached = global._mongoCache || (global._mongoCache = { conn: null, promise: null });

module.exports = async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000, bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
};
