import dns from "node:dns";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js"

dns.setServers(['8.8.8.8', '8.8.4.4']);

const port = process.env.PORT || 3000

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.on("ERROR", (error) => {
        console.log(`Error: ${error}`);
        throw error
    })

    app.listen( port, () => {
        console.log(`⚙️  SERVER is running at http://localhost:${port}`);
    });
})
.catch((error) => {
    console.log("Mongo DB connetion FAILED", error);
})