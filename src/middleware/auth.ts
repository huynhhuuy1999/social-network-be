import { jwtDefault } from "@/constants";
import { STATUS } from "@/enum/common";
import { decodeToken, verifyToken } from "@/utils";
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

  if (verified.payload.email === "xxx")
    // const user = await userModle.getUser(verified.payload.username);
    req.email = "xxx";

  return next();
};

export const checkRefreshToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const body: { refreshToken: string } = req.body;
  const header = req.headers;
  const accessTokenFromHeader = req.headers["authorization"];
  if (!accessTokenFromHeader) {
    return res.status(STATUS.UNAUTHORIZED).send("Refresh failed");
  }

  if (!body.refreshToken) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .send("Không tìm thấy refresh token.");
  }

  if (
    (accessTokenFromHeader.split(" ").length > 1 &&
      accessTokenFromHeader.split(" ")[0] !== "Bearer") ||
    accessTokenFromHeader.split(" ").length === 1
  )
    return res.status(STATUS.UNAUTHORIZED).send("Token không hợp lệ");

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;

  const newHeader = accessTokenFromHeader.split(" ")[1];

  const decoded = await decodeToken(newHeader, accessTokenSecret);
  if (!decoded) {
    return res.status(STATUS.BAD_REQUEST).send("Access token không hợp lệ.");
  }
  const email = decoded.payload.email; // Lấy email từ payload

  if (email !== "xxx") {
    return res.status(STATUS.UNAUTHORIZED).send("Email không tồn tại");
  }

  // check refresh token with token in schema user

  req.email = email;
  return next();
};

export const middlewareTest = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  req.xxx = "123455";
  return next();
};
