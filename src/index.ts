require("module-alias/register");
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { authRouter } from "./routes";

const app = express();

const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// Combined , Common , Short , Dev , Tiny
app.use(morgan("tiny"));

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(authRouter);
