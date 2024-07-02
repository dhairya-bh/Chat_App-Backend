import { CreateUserDetails, FindUserParams } from "src/utils/types";
import { User } from "./entities/user.entity";

export interface IUserService {
    createUser(userDetails : CreateUserDetails):Promise<User>;
    findUser(findUserParams : FindUserParams):Promise<User>;
    saveUser(user: User): Promise<User>;
}