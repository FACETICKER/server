import  express  from "express";
import compression from "compression";
import methodOverride from "method-override";
import cors from "cors";
import {sequelize} from "../models/index.js";
import userRouter from "../src/app/user/userRoute.js";

const app = express();

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride());
app.use(cors());
app.use('/',userRouter);

export default app;