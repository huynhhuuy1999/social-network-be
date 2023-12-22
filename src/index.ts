require("module-alias/register");
import "dotenv/config";
import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./routes";
import { ValidateError } from "tsoa";

const app = express();

const port = process.env.PORT || 3002;

app.use(express.json());
// Combined , Common , Short , Dev , Tiny
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// app.use(function notFoundHandler(_req, res: ExResponse) {
//   res.status(404).send({
//     message: "Not Found",
//   });
// });

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(authRouter);
