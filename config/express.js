import express from "express";
import compression from "compression";
import methodOverride from "method-override";
import cors from "cors";
import userRouter from "../src/app/user/userRoute.js";
import { specs, swaggerUi } from "./swagger.js";
const app = express();

app.use(compression());
app.use(express.json({
  limit : "10mb"
}));
app.use(express.urlencoded({ 
  limit : "10mb",
  extended: true 
}));
app.use(methodOverride());
app.use(cors());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use("/", userRouter);

export default app;
