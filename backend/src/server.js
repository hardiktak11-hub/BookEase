import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on PORT ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("Server Error", error);
});