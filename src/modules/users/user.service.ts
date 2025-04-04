import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/user";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt"
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {} 

  async createUser(payload: CreateUserDto): Promise<{
    message: string,
    user: User
  }> {
    const { name, email, password, account_type, avatar_url } = payload;

    const existing_user = await this.userRepository.findOne({ where: { email }});
    if (existing_user) throw new ConflictException("User already exists");

    const salt = await bcrypt.genSalt()
    const hashed_password = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      name,
      email,
      password: hashed_password,
      role: account_type,
      is_verified: true,
      avatar_url
    });

    await this.userRepository.save(user);

    return {
      message: "Successfully created user",
      user
    }
  }

  async findUser(id: string): Promise<{
    message: string,
    user: User
  }> {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException("User not found");

    return {
      message: "Successfully retrieved user",
      user
    }
  }

  async getAllUsers(page: number, limit: number): Promise<{
    message: string,
    users: User[],
    meta: {
      total: number,
      current_page: number,
      total_pages: number
    }
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit
    });

    return {
      message: "Successfully retrieved users",
      users,
      meta: {
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      }
    }
  }

  async updateUser(id: string, payload: UpdateUserDto): Promise<{
    message: string,
    user: User
  }> {
    const { user } = await this.findUser(id);

    await this.userRepository.update(user.id, payload);

    const updated_user = await this.findUser(user.id);

    return {
      message: "Successfully updated user data",
      user: updated_user.user
    }
  }

  async deleteUser(id: string): Promise<{message: string}> {
    const deleted_user = await this.userRepository.softDelete(id);
    if (deleted_user.affected === 0) throw new BadRequestException("Could not delete user");

    return {
      message: "Successfully deleted user data"
    }
  }
}