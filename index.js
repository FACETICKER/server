import dotenv from "dotenv";
import app from "./config/express.js";
import authRouter from "./src/app/auth/authRoute.js";
dotenv.config();


app.use('/',authRouter);
app.listen(process.env.SERVER_PORT, ()=>{
    console.log("server is ready");
});