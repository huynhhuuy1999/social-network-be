import { Get, Route } from "tsoa";

@Route("auth")
export default class AuthController {
  @Get("/login")
  public async getMessage(): Promise<any> {
    return {
      message: "login",
    };
  }
  @Get("/register")
  public async getMessage2(): Promise<any> {
    return {
      message: "register",
    };
  }
}
