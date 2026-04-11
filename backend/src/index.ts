import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { rootRouter } from "./routes";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api", rootRouter);
app.listen(PORT, () => {
  console.log("It's working perfectly");
});
