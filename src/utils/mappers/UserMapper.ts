import { User } from "../../domain/User.js";
import type { RequestCreateUserDto } from "../dtos/user/RequestCreateUserDto.js";
import type { ResponseFindManyUsersDTO } from "../dtos/user/ResponseFindManyUsersDTO.js";

export class UserMapper {
  static requestDtoToEntity(createUserDto: RequestCreateUserDto): User {
    return new User(
      "",
      createUserDto.name,
      createUserDto.slug,
      createUserDto.email,
      createUserDto.password,
      new Date(0),
      new Date(0),
    )
  }

  static entityToResponseDto(user: User): ResponseFindManyUsersDTO {
    return {
      id: user.getId(),
      name: user.getName(),
      slug: user.getSlug(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt()
    } as ResponseFindManyUsersDTO
  }
}