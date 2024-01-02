import { jwtDefault } from "@/constants";
import { STATUS } from "@/enum/common";
import { AuthService } from "@/services/auth.service";
import { generateToken } from "@/utils";
import { generate } from "rand-token";
import {
  LoginParams,
  RegisterParams,
  ResponseDefault,
  ResponseLogin,
  User,
} from "@/models/auth";

export default class AuthController {
  public async postRegister(
    requestBody: RegisterParams
  ): Promise<ResponseDefault> {
    const email = requestBody.email.toLowerCase();
    // check account exist
    if (email === "huynhhuuy@gmail.com") {
      return {
        message: "email exists",
        status: STATUS.CONFLICT,
      };
    }

    // this.setStatus(STATUS.CREATED);
    return {
      message: "Register success",
      status: STATUS.SUCCESS,
      ...requestBody,
    };
  }

  public async postLogin(requestBody: LoginParams): Promise<ResponseLogin> {
    // check users
    if (requestBody.email !== "xxx" || requestBody.password !== "123456") {
      return {
        message: "Login failed",
        status: STATUS.UNAUTHORIZED,
      };
    }
    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
    const dataForAccessToken = {
      email: requestBody.email,
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

    // this.setStatus(STATUS.CREATED);
    return {
      message: "Login success",
      status: STATUS.SUCCESS,
      accessToken,
      refreshToken,
    };
  }

  public async postRefreshToken(requestBody: {
    email?: string;
  }): Promise<ResponseLogin> {
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
    // Tạo access token mới
    const dataForAccessToken = {
      email: requestBody.email || "",
      // email: req.email,
    };

    const accessToken = await generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) {
      return {
        message: "Tạo access token không thành công, vui lòng thử lại.",
        status: STATUS.BAD_REQUEST,
      };
    }
    return {
      message: "Refresh success",
      status: STATUS.SUCCESS,
      accessToken,
    };
  }

  public async getTestApi(): Promise<ResponseDefault> {
    return {
      message: "test",
      status: STATUS.SUCCESS,
    };
  }

  public async getUser(userId: string, address: string): Promise<User> {
    const authInfo = new AuthService().get(Number(userId), address);
    return authInfo;
  }

  public async testMiddleware(
    requestBody: {
      email?: string;
    },
    xxx: string
  ): Promise<ResponseDefault> {
    console.log("xxx", xxx);
    return {
      message: "test",
      status: STATUS.SUCCESS,
    };
  }
}
