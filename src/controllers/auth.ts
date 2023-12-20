import { Get, Route } from "tsoa";

@Route("auth")
export default class AuthController {
  @Get("/")
  public async getMessage(): Promise<any> {
    return {
      message: "hello",
    };
  }
}
