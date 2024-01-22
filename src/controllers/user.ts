import { STATUS } from "@/enum/common";
import { RequestUser, User } from "@/models/auth";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

export const getUser = async (
  req: RequestUser,
  res: Response
): Promise<Response<User>> => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(STATUS.SUCCESS).send(req.user);
  } else {
    const prisma = new PrismaClient();
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      await prisma.$disconnect();
      if (user) {
        return res
          .status(STATUS.SUCCESS)
          .send({ ...user, password: null, refreshToken: null });
      }
      return res.status(STATUS.BAD_REQUEST).send("Get user fail");
    } catch (error) {
      await prisma.$disconnect();
      return res.status(STATUS.BAD_REQUEST).send("Get user fail");
    }
  }
};
