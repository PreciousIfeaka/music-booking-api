import { Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { AuthSessionGuard } from "../../guards/auth.guard";
import { RoleGuard } from "../../guards/role.guard";
import { Roles } from "../../decorators/role.decorator";
import { Role } from "./entities/user";

@ApiBearerAuth()
@Controller("users")
@UseGuards(AuthSessionGuard, RoleGuard)
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of results per page (default: 10)" })
  async findAllUsers(@Query("page") page?: number, @Query("limit") limit?: number) {
    return await this.userService.getAllUsers(page ?? 1, limit ?? 10);
  }

  @Get("profile")
  async getUser(@Req() req: Request) {
    return await this.userService.findUser(req.user.user_id);
  }

  @Roles(Role.ADMIN)
  @Get(":id")
  async getUserByAdmin(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.userService.findUser(id);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async deleteUser(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteUser(id);
  }
}