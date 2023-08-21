import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/erros/AppError";
import { validatePassword } from "../../../../utils/passwordUtils";


interface IRequest {
    nameOrEmail: string
    password: string
}

interface IResponse {
    user: {
        id: string
        name: string,
        admin?: boolean 
    }
    // created_at: Date

}


@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        // @inject("DayjsDateProvider")
        // private dateProvider: IDateProvider,
        // @inject("CacheProvider")
        // private cacheProvider: ICacheProvider,
    ) { }

    async execute({ nameOrEmail, password }: IRequest): Promise<IResponse> {

        // nameOrEmail = nameOrEmail.replace(/\s+$/g, "")

        const user = await this.usersRepository.findByNameOrEmail({email: nameOrEmail, name: nameOrEmail}); //mudar depois


        if (!user) {
            throw new AppError("nome de usuário ou senha incorretos", 401)
        }

        const passwordMatch = validatePassword(password, user.salt, user.password_hash)

        if (!passwordMatch) {
            throw new AppError("nome de usuário ou senha incorretos", 401)

        }

        
        // precisa criar se vai salvar a session do user no redis?
        // await this.cacheProvider.set(`user-${user.id}`, JSON.stringify(instanceToPlain(user)))

        // const created_at = this.dateProvider.dateNow()


        return {
            user: {
                id: user.id,
                name: user.name,
                admin: user.admin
            },
            // created_at
        }
        
        
        
        
    }

}

export { AuthenticateUserUseCase }