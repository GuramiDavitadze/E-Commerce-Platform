import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { rootRouter } from "./routes";
import { checkAPISecretKey, generalLimiter } from "./middlewares";
import { Request, Response } from "express";
import { setupSwagger } from "./config/swagger";
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 3008;
app.use(
  cors({
    origin: process.env.NEXT_BASE_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);
setupSwagger(app);
app.use("/api", checkAPISecretKey, rootRouter);
app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log("It's working perfectly");
});
