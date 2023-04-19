import mongoose from "mongoose";

const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URL, {
            dbName: "Social_Media",
        })
        .then(() => console.log("Database Connected"))
        .catch((e) => console.log(e));
};

export { connectDB };
