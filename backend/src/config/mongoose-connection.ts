import mongoose from "mongoose";

const connectDB = (): Promise<void> =>
  mongoose
    .connect(`${process.env.MONGODB_URI}`)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
    });

export { connectDB };
