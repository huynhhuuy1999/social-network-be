import { SALT_ROUNDS, jwtDefault } from "@/constants";
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
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generate } from "rand-token";
import bcrypt from "bcrypt";

export const postRegister = async (
  _req: Request,
  res: Response
): Promise<ResponseDefault | any> => {
  const body: RegisterParams = _req.body;
  const { birthDate, email, firstName, gender, password, surname } = body;
  const infoRegister: RegisterParams = {
    email,
    password,
    birthDate,
    firstName,
    gender,
    surname,
  };

  const prisma = new PrismaClient();
  // check account exist
  const getUser = await prisma.user.findFirst({ where: { email } });

  if (getUser?.email === email) {
    return res.status(STATUS.CONFLICT).send("email exists");
  }
  const passwordHash = bcrypt.hashSync(body.password, SALT_ROUNDS);

  await prisma.account.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      birthDate,
      firstName,
      gender,
      surname,
    },
  });

  await prisma.$disconnect();
  return res
    .status(STATUS.SUCCESS)
    .send({ message: "Register success", ...infoRegister, password: null });
};

export const postLogin = async (
  req: Request,
  res: Response
): Promise<ResponseLogin | any> => {
  // check users

  const body: LoginParams = req.body;
  const { email: emailBody, password: passwordBody } = body;

  const prisma = new PrismaClient();
  const getUser = await prisma.user.findFirst({ where: { email: emailBody } });

  if (!getUser) {
    return res.status(STATUS.UNAUTHORIZED).send("Login failed");
  }
  const { birthDate, firstName, gender, surname, id, password, email } =
    getUser;

  const isPasswordValid = bcrypt.compareSync(passwordBody, password);
  if (!isPasswordValid) {
    return res.status(STATUS.UNAUTHORIZED).send("Mật khẩu không chính xác.");
  }

  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;

  const dataForAccessToken = {
    email,
    birthDate,
    gender,
    firstName,
    surname,
    id,
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
