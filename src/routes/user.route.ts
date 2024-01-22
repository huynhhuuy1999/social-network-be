import { getUser } from "@/controllers/user";
import { isAuth } from "@/middleware/auth";
import express from "express";

export const userRouter = express.Router();

userRouter.get("/user", isAuth, getUser as any);
