import { CreateUserDto } from "../users/dtos/create-user.dto";
import { User } from "../users/entities/user";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async registerUser(payload: CreateUserDto): Promise<{
    message: string,
    user: User,
    access_token: string
  }> {
    const { user, message } = await this.userService.createUser(payload);

    const access_token = await this.jwtService.signAsync({
      sub: user.id, is_verified: true
    });

    return {
      message,
      user,
      access_token,
    }
  }

  async login(payload: LoginDto): Promise<{
    message: string,
    user: User,
    access_token: string
  }> {
    const { email, password } = payload;

    const user = await this.userRepository.findOne({ where: { email }});
    if (!user) throw new NotFoundException("Invalid login credentials");

    const password_match = await bcrypt.compare(password, user.password);

    if (!password_match) throw new NotFoundException("Invalid login credentials");

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
    });

    return {
      message: "User successfully signed in",
      user,
      access_token
    }
  }
}