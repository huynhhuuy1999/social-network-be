import { STATUS } from "@/enum/common";
import { RequestUser } from "@/models/auth";
import { verifyToken } from "@/utils";
import { NextFunction, Response } from "express";

export const isAuth = async (req: any, res: Response, next: NextFunction) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers["authorization"];
  if (!accessTokenFromHeader) {
    return res.status(STATUS.UNAUTHORIZED).send("Không tìm thấy access token!");
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const newHeader = req.headers["authorization"].split(" ")[1];

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
