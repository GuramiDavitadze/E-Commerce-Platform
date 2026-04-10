import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import cookieParser = require("cookie-parser");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter);
app.listen(PORT, () => {
  console.log("It's working perfectly");
});
