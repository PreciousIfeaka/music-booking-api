import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post("register")
  async registerUser(@Body() body: CreateUserDto) {
    return this.authService.registerUser(body);
  }

  @Post("login")
  async loginUser(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

}