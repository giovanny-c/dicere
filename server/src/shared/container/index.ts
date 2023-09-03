import { container } from "tsyringe";


import "./providers/index"

import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";
import { UserRepository } from "../../modules/users/repositories/implementations/UsersRepository";


container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UserRepository
)