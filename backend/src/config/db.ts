import mongoose from "mongoose";

const connectDB = async (): Promise<typeof mongoose | void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export { connectDB };
