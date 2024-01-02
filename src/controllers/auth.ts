import { jwtDefault } from "@/constants";
import { STATUS } from "@/enum/common";
import {
  LoginParams,
  RegisterParams,
  RequestUser,
  ResponseDefault,
  ResponseLogin,
  User,
} from "@/models/auth";
import { AuthService } from "@/services/auth.service";
import { generateToken } from "@/utils";
import { Request, Response } from "express";
import { generate } from "rand-token";

export const postRegister = async (
  _req: Request,
  res: Response
): Promise<ResponseDefault | any> => {
  const body: RegisterParams = _req.body;
  const infoRegister: RegisterParams = {
    email: body.email,
    password: body.password,
  };
  const email = infoRegister.email.toLowerCase();
  // check account exist
  if (email === "huynhhuuy@gmail.com") {
    return res.status(STATUS.CONFLICT).send("email exists");
  }

  return res
    .status(STATUS.SUCCESS)
    .send({ message: "Register success", ...infoRegister });
};

export const postLogin = async (
  req: Request,
  res: Response
): Promise<ResponseLogin | any> => {
  // check users

  const body: RegisterParams = req.body;
  const infoLogin: LoginParams = {
    email: body.email,
    password: body.password,
  };

  if (infoLogin.email !== "xxx" || infoLogin.password !== "123456") {
    return res.status(STATUS.UNAUTHORIZED).send("Login failed");
  }
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
  const dataForAccessToken = {
    email: infoLogin.email,
  };

  const accessToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );

  if (!accessToken) {
    return {
      message: "Login failed",
      status: STATUS.UNAUTHORIZED,
    };
  }

  let refreshToken = generate(jwtDefault.refreshTokenSize);

  return res.status(STATUS.SUCCESS).send({
    message: "Login success",
    accessToken,
    refreshToken,
  });
};

export const postRefreshToken = async (
  req: RequestUser | any,
  res: Response
): Promise<ResponseLogin | any> => {
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
  // Tạo access token mới
  const dataForAccessToken = {
    email: req.email || "",
  };

  const accessToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send("Tạo access token không thành công, vui lòng thử lại.");
  }
  return res.status(STATUS.SUCCESS).send({
    message: "Refresh success",
    accessToken,
  });
};

export const getUser = async (
  req: RequestUser | any,
  res: Response
): Promise<User> => {
  const userId = req.params.userId;
  const authInfo = new AuthService().get(
    Number(userId),
    req.query.address as string
  );
  return authInfo;
};
