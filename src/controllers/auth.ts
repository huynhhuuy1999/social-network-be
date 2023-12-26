import { AuthService } from "@/services/auth.service";
import {
  ResponseDefault,
  LoginParams,
  RegisterParams,
  User,
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
} from "tsoa";
import { STATUS } from "@/enum/common";

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
      this.setStatus(STATUS.CONFLICT);
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
  ): Promise<ResponseDefault> {
    this.setStatus(STATUS.CREATED);
    return {
      message: "Login success",
      status: STATUS.SUCCESS,
      ...requestBody,
    };
  }

  @Get("/test")
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
