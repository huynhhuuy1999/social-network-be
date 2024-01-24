import { jwtDefault } from "@/constants";
import { STATUS } from "@/enum/common";
import { User } from "@/models/auth";
import { ResponseProperties } from "@/models/common";
import { decodeToken, verifyToken } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";

export const isAuth = async (req: any, res: Response, next: NextFunction) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers["authorization"];
  if (!accessTokenFromHeader) {
    return res.status(STATUS.UNAUTHORIZED).send("Không tìm thấy access token!");
  }
  if (
    (accessTokenFromHeader.split(" ").length > 1 &&
      accessTokenFromHeader.split(" ")[0] !== "Bearer") ||
    accessTokenFromHeader.split(" ").length === 1
  )
    return res.status(STATUS.UNAUTHORIZED).send("Token không hợp lệ");
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const newHeader = accessTokenFromHeader.split(" ")[1];

  const verified = await verifyToken(newHeader, accessTokenSecret);
  if (!verified) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .send("Bạn không có quyền truy cập vào tính năng này!");
  }
  const prisma = new PrismaClient();
  if (verified.payload.email) {
    const user = await prisma.user.findFirst({
      where: { email: verified.payload.email },
    });
    await prisma.$disconnect();
    if (user) {
      req.user = { ...user, password: null, refreshToken: null };
    } else {
      return res
        .status(STATUS.UNAUTHORIZED)
        .send("Bạn không có quyền truy cập vào tính năng này!");
    }
  } else {
    return res
      .status(STATUS.UNAUTHORIZED)
      .send("Bạn không có quyền truy cập vào tính năng này!");
  }
  return next();
};

export const checkRefreshToken = async (
  req: any,
  res: Response<ResponseProperties<User>>,
  next: NextFunction
) => {
  const body: { refreshToken: string } = req.body;
  const accessTokenFromHeader = req.headers["authorization"];
  if (!accessTokenFromHeader) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .send({ isError: true, message: "Refresh token failed" });
  }

  if (!body.refreshToken) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .send({ isError: true, message: "Không tìm thấy refresh token." });
  }

  if (
    (accessTokenFromHeader.split(" ").length > 1 &&
      accessTokenFromHeader.split(" ")[0] !== "Bearer") ||
    accessTokenFromHeader.split(" ").length === 1
  )
    return res
      .status(STATUS.UNAUTHORIZED)
      .send({ isError: true, message: "Token không hợp lệ" });

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;

  const newHeader = accessTokenFromHeader.split(" ")[1];

  const decoded = await decodeToken(newHeader, accessTokenSecret);
  if (!decoded) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send({ isError: true, message: "Token không hợp lệ" });
  }
  const prisma = new PrismaClient();
  const email = decoded.payload.email; // Lấy email từ payload
  if (email) {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    await prisma.$disconnect();
    if (user) {
      if (user.refreshToken !== body.refreshToken) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .send({ isError: true, message: "Refresh token failed" });
      }
      req.user = { ...user, password: null, refreshToken: null };
      return next();
    }
    return res
      .status(STATUS.UNAUTHORIZED)
      .send({ isError: true, message: "Refresh token failed" });
  }
  return res
    .status(STATUS.UNAUTHORIZED)
    .send({ isError: true, message: "Refresh token failed" });
};
