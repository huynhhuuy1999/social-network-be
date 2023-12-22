import { RegisterParams, User } from "@/models/auth";

export class AuthService {
  public get(id: number, name?: string): User {
    return {
      id,
      userName: "jane@doe.com",
      address: "Happy",
    };
  }

  public create(userCreationParams: RegisterParams): User {
    return {
      id: Math.floor(Math.random() * 10000), // Random
      userName: "Happy",
      ...userCreationParams,
    };
  }
}
