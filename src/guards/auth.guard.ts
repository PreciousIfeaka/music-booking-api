import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      user_id: string;
      account_type: string;
    };
  }
}
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../modules/users/user.service";

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor (
      private jwtService: JwtService,
      private userService: UserService
    ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request): Promise<boolean> {
    const bearer_token = request.headers.authorization;

    if (!bearer_token)
      throw new UnauthorizedException(
        "Please provide Bearer token in Authorization header.",
      );

    const auth_token = bearer_token.split(" ")[1];
    if (!auth_token)
      throw new UnauthorizedException(
        "Auth token not found in Authorization header.",
      );

    const decoded_token: { sub: string } = await this.jwtService.verifyAsync(auth_token);

    if (!decoded_token)
      throw new UnauthorizedException(
        "Invalid auth token or token has expired, please login to get new token.",
      );

    const { user } = await this.userService.findUser(decoded_token.sub);

    request.user = {
      user_id: user.id,
      account_type: user.role
    };
    return true;
  }
}