import { User } from "../../domain/User.js";
import type { RequestLoginUserDto } from "../dtos/auth/RequestLoginUserDto.js";
import type { RequestCreateUserDto } from "../dtos/user/RequestCreateUserDto.js";

export class UserMapper {
  static requestDtoToEntity(createUserDto: RequestCreateUserDto): User {
    return new User(
      "",
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      new Date(0),
      new Date(0),
    )
  }

  static entityToResponseDto(user: User) {
    // return new User(
    //   "",
    //   createUserDto.name,
    //   createUserDto.email,
    //   createUserDto.password,
    //   new Date(0),
    //   new Date(0),
    // )
  }
}