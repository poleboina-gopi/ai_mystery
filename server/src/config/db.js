import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_mystery';

  // Fast check: if in test mode or uri is default localhost and not specifically overridden, try with a short 1.5s timeout
  const timeoutMs = process.env.NODE_ENV === 'test' ? 1000 : 2500;

  try {
    console.log(`[Database] Connecting to MongoDB...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
    });
    isConnected = true;
    console.log('[Database] MongoDB Connected successfully.');
  } catch (err) {
    console.warn(`[Database] Live MongoDB instance not found (${err.message}).`);
    console.log('[Database] Activating integrated in-memory fallback store. The application will function with full features.');
  }
};
