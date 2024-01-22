import { postLogin, postRefreshToken, postRegister } from "@/controllers/auth";
import { checkRefreshToken } from "@/middleware/auth";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/auth/register", postRegister);
authRouter.post("/auth/login", postLogin);
authRouter.post("/auth/refreshToken", checkRefreshToken, postRefreshToken);
