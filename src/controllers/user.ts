import { STATUS } from "@/enum/common";
import { RequestUser, User } from "@/models/auth";
import { ResponseProperties } from "@/models/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

export const getUser = async (
  req: RequestUser,
  res: Response<ResponseProperties<User>>
) => {
  const userId = req.body.userId;
  if (!userId) {
    return res
      .status(STATUS.SUCCESS)
      .send({
        isError: false,
        message: "Get user success",
        data: { ...req.user, password: "" },
      });
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
          .send({
            isError: false,
            data: { ...user, password: "", refreshToken: "" },
          });
      }
      return res
        .status(STATUS.BAD_REQUEST)
        .send({ isError: true, message: "Get user fail" });
    } catch (error) {
      await prisma.$disconnect();
      return res
        .status(STATUS.BAD_REQUEST)
        .send({ isError: true, message: "Get user fail" });
    }
  }
};
