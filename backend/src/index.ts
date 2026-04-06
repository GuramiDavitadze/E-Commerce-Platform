import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config;
const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(helmet());
app.use(express());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Everything okey" });
});
app.listen(PORT, () => {
  console.log("It's working perfectly");
});
