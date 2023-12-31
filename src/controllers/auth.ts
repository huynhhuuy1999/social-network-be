import { AuthService } from "@/services/auth.service";
import {
  ResponseDefault,
  LoginParams,
  RegisterParams,
  User,
  ResponseLogin,
} from "../models/auth";
import {
  Get,
  Route,
  Post,
  Body,
  Controller,
  SuccessResponse,
  Path,
  Query,
  Response,
  Tags,
  Security,
} from "tsoa";
import { STATUS } from "@/enum/common";
import { generateToken } from "@/utils";
import { generate } from "rand-token";
import { jwtDefault } from "@/constants";

interface ValidateSTATUSJSON {
  message: "Validation failed";
  details: { [name: string]: unknown };
}

@Route("auth")
@Tags("Auth")
export default class AuthController extends Controller {
  /**
   * Register User
   */
  @SuccessResponse("201", "Created") // Custom success response
  @Post("/register")
  public async postRegister(
    @Body() requestBody: RegisterParams
  ): Promise<ResponseDefault> {
    const email = requestBody.email.toLowerCase();
    // check account exist
    if (email === "huynhhuuy@gmail.com") {
      return {
        message: "email exists",
        status: STATUS.CONFLICT,
      };
    }

    this.setStatus(STATUS.CREATED);
    return {
      message: "Register success",
      status: STATUS.SUCCESS,
      ...requestBody,
    };
  }

  @SuccessResponse("200", "Login success")
  @Post("/login")
  public async postLogin(
    @Body() requestBody: LoginParams
  ): Promise<ResponseLogin> {
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

    this.setStatus(STATUS.CREATED);
    return {
      message: "Login success",
      status: STATUS.SUCCESS,
      accessToken,
      refreshToken,
    };
  }

  @SuccessResponse("200", "Refresh success")
  @Post("/refreshToken")
  @Security("jwt")
  public async postRefreshToken(
    @Body()
    requestBody: {
      refreshToken?: string;
    }
  ): Promise<ResponseLogin> {
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtDefault.accessTokenSecret;
    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtDefault.accessTokenLife;
    // Tạo access token mới
    const dataForAccessToken = {
      email: "xxx",
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

  @Get("/test")
  @Security("jwt")
  public async getTestApi(): Promise<ResponseDefault> {
    return {
      message: "test",
      status: STATUS.SUCCESS,
    };
  }

  /**
   * @param userId The user's identifier
   */
  @Response<ValidateSTATUSJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Get Success")
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
    @Query() address: string
  ): Promise<User> {
    this.setStatus(STATUS.SUCCESS);
    const authInfo = new AuthService().get(Number(userId), address);
    return authInfo;
  }
}
