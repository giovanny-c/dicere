import { ICreateUser, IFindUser} from "../dtos/IUsersDTOs"
import { User } from "../entities/User"



interface IUsersRepository {

    create(data: ICreateUser): Promise<User>
    findBy(params: Partial<IFindUser>): Promise<User[]>
    findById(params: Pick<IFindUser, "id">): Promise<User>
    findByNameOrEmail(params: Partial<Pick<IFindUser, "email" | "name">>) : Promise<User>
    //torna o email e name opicional?
}

export {IUsersRepository}