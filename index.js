import dotenv from "dotenv";
import app from "./config/express.js";
dotenv.config();

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`server is ready, ${process.env.SERVER_PORT}`);
    console.log(`${process.env.DB_HOST}, ${process.env.DB_NAME}, ${process.env.DB_PASS}, ${process.env.DB_USER}`);
});