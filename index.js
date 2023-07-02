import dotenv from "dotenv";
import app from "./config/express.js";
import userRouter from "./src/app/user/userRoute.js";
dotenv.config();


app.use('/',userRouter);
app.listen(process.env.SERVER_PORT, ()=>{
    console.log("server is ready");
});