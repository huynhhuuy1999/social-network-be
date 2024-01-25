import { SALT_ROUNDS, jwtDefault } from "@/constants";
import { STATUS } from "@/enum/common";
import { LoginParams, RegisterParams, RegisterResponse } from "@/models/auth";
import { ResponseProperties } from "@/models/common";
import { generateToken } from "@/utils";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generate } from "rand-token";

export const postRegister = async (
  _req: Request,
  res: Response<ResponseProperties<RegisterParams>>
) => {
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
    return res
      .status(STATUS.CONFLICT)
      .send({ isError: true, message: "email exists" });
  }
  const passwordHash = bcrypt.hashSync(body.password, SALT_ROUNDS);

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      birthDate,
      firstName,
      gender,
      surname,
      refreshToken: "",
      avatar: "",
    },
  });

  await prisma.$disconnect();
  return res.status(STATUS.SUCCESS).send({
    isError: false,
    message: "Register success",
    data: { ...infoRegister, password: "" },
  });
};

export const postLogin = async (
  req: Request,
  res: Response<ResponseProperties<RegisterResponse>>
) => {
  // check users
  const body: LoginParams = req.body;
  const { email: emailBody, password: passwordBody, browserId } = body;
  const prisma = new PrismaClient();
  const getUser = await prisma.user.findFirst({ where: { email: emailBody } });
  if (!getUser) {
    return res.status(STATUS.UNAUTHORIZED).send({
      isError: true,
      message: "Login failed",
    });
  }
  const { birthDate, firstName, gender, surname, id, password, email, avatar } =
    getUser;
  const isPasswordValid = bcrypt.compareSync(passwordBody, password || "");
  if (!isPasswordValid) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .send({ isError: true, message: "Mật khẩu không chính xác." });
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
      isError: true,
    };
  }
  let refreshToken = generate(jwtDefault.refreshTokenSize);
  if (!getUser.refreshToken) {
    // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        refreshToken,
      },
    });
  } else {
    // Nếu user này đã có refresh token thì lấy refresh token đó từ database
    refreshToken = getUser.refreshToken;
  }

  await prisma.$disconnect();
  return res.status(STATUS.SUCCESS).send({
    message: "Login success",
    isError: false,
    data: {
      accessToken,
      refreshToken,
      infoUser: getUser,
    },
  });
};

export const postRefreshToken = async (
  req: any,
  res: Response<ResponseProperties<any>>
) => {
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
  // Tạo access token mới
  const dataForAccessToken = req.user;

  const accessToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res.status(STATUS.BAD_REQUEST).send({
      isError: true,
      message: "Tạo access token không thành công, vui lòng thử lại.",
    });
  }
  return res.status(STATUS.SUCCESS).send({
    isError: false,
    message: "Refresh success",
    data: { accessToken },
  });
};
