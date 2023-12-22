import AuthController from "@/controllers/auth";
import { RegisterParams } from "@/models/auth";
import express, { Request } from "express";

export const authRouter = express.Router();

authRouter.post(
  "/auth/register",
  async (_req: Request<RegisterParams>, res) => {
    const controller = new AuthController();

    const infoRegister: RegisterParams = {
      address: _req.body.address,
      userName: _req.body.userName,
    };

    const response = await controller.postRegister(infoRegister);
    return res.send(response);
  }
);

authRouter.get("/auth/login", async (_req, res) => {
  const controller = new AuthController();
  const response = await controller.getMessage2();
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
// export default router;
