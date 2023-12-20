import AuthController from "@/controllers/auth";
import express from "express";

export const authRouter = express.Router();

authRouter.get("/auth/login", async (_req, res) => {
  const controller = new AuthController();
  const response = await controller.getMessage();
  return res.send(response);
});

authRouter.get("/auth/register", async (_req, res) => {
  const controller = new AuthController();
  const response = await controller.getMessage2();
  return res.send(response);
});
// export default router;
