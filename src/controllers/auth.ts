import { AuthResponse, RegisterParams, User } from "../models/auth";
import {
  Get,
  Route,
  Post,
  Body,
  Controller,
  SuccessResponse,
  Path,
  Query,
} from "tsoa";

@Route("auth")
export default class AuthController extends Controller {
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

  @Get("/login")
  public async getMessage2(): Promise<AuthResponse> {
    return {
      message: "login",
    };
  }

  @SuccessResponse("200", "Get Success")
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
    @Query() address?: string
  ): Promise<User> {
    this.setStatus(200);
    return {
      address,
      userName: userId,
    };
  }
}
