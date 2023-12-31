import AuthController from "@/controllers/auth";
import { STATUS } from "@/enum/common";
import { LoginParams, RegisterParams } from "@/models/auth";
import express, { Request, Response } from "express";
import { decodeToken } from "@/utils";
import { jwtDefault } from "@/constants";
import { isAuth } from "@/middleware/auth";

export const authRouter = express.Router();

authRouter.post("/auth/register", async (_req: Request, res: Response) => {
  const controller = new AuthController();
  const body: RegisterParams = _req.body;
  const infoRegister: RegisterParams = {
    email: body.email,
    password: body.password,
  };

  const response = await controller.postRegister(infoRegister);

  res.status(response.status || STATUS.SUCCESS);
  return res.send(response);
});

authRouter.post("/auth/login", async (_req: Request, res: Response) => {
  const controller = new AuthController();
  const body: RegisterParams = _req.body;
  const infoLogin: LoginParams = {
    email: body.email,
    password: body.password,
  };
  const response = await controller.postLogin(infoLogin);
  res.status(response.status || STATUS.SUCCESS);
  return res.send(response);
});

authRouter.post("/auth/refreshToken", async (_req: Request, res: Response) => {
  const controller = new AuthController();
  const body: { refreshToken: string } = _req.body;
  const header = _req.headers;

  const info = {
    refreshToken: body.refreshToken,
  };
  if (!header["authorization"]) {
    return res.status(STATUS.UNAUTHORIZED).send({ message: "Refresh failed" });
  }
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
  const newHeader = header["authorization"].split(" ")[1];

  const decoded = await decodeToken(newHeader, accessTokenSecret);
  if (!decoded) {
    return res.status(STATUS.BAD_REQUEST).send({
      message: "Access token không hợp lệ.",
      status: STATUS.BAD_REQUEST,
    });
  }
  const email = decoded.payload.email; // Lấy email từ payload

  if (email !== "xxx") {
    return res.status(STATUS.UNAUTHORIZED).send({
      message: "Email khong ton tai",
      status: STATUS.UNAUTHORIZED,
    });
  }
  const response = await controller.postRefreshToken(info);
  res.status(response.status || STATUS.SUCCESS);
  return res.send(response);
});

authRouter.get("/auth/test", isAuth, async (_req: any, res) => {
  const controller = new AuthController();
  console.log(_req.email);
  const response = await controller.getTestApi();
  return res.send(response);
});

authRouter.get("/auth/:userId", async (req: Request, res) => {
  const controller = new AuthController();
  const userId = req.params.userId;
  const response = await controller.getUser(
    userId,
    req.query.address as string
  );
  return res.send(response);
});
