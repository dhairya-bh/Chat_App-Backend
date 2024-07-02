import { ValidateUserDetails } from "src/utils/types";

export interface IAuthService {
    validateUser(userCreds:ValidateUserDetails);
}