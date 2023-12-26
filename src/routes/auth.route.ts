import AuthController from "@/controllers/auth";
import { STATUS } from "@/enum/common";
import { LoginParams, RegisterParams } from "@/models/auth";
import express, { Request, Response } from "express";

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
  return res.send(response);
});

authRouter.get("/auth/test", async (_req, res) => {
  const controller = new AuthController();
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
