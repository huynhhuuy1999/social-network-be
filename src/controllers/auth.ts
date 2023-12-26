import { AuthService } from "@/services/auth.service";
import {
  AuthResponse,
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

interface ValidateErrorJSON {
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
  ): Promise<AuthResponse> {
    this.setStatus(201);
    return {
      message: "Register success",
      ...requestBody,
    };
  }

  @SuccessResponse("200", "Login success")
  @Post("/login")
  public async postLogin(
    @Body() requestBody: LoginParams
  ): Promise<AuthResponse> {
    this.setStatus(201);
    return {
      message: "Login success",
      ...requestBody,
    };
  }

  @Get("/test")
  public async getTestApi(): Promise<AuthResponse> {
    return {
      message: "test",
    };
  }

  /**
   * @param userId The user's identifier
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Get Success")
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
    @Query() address: string
  ): Promise<User> {
    this.setStatus(200);
    const authInfo = new AuthService().get(Number(userId), address);
    return authInfo;
  }
}
