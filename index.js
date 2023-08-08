import dotenv from "dotenv";
import app from "./config/express.js";
dotenv.config();

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server is ready, ${process.env.SERVER_PORT}`);
});

// 배포 메세지 출력(/app/health가 아닌 기본 라우팅으로 설정함)
app.get("/", (req, res) => {
  res.json({ result: "Deploy success!" });
});
