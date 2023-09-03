import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/erros/AppError";
import { genPassword } from "../../../../utils/passwordUtils";



interface IRequest{

    name: string,
    email: string,
    password: string,
    admin: boolean
}


@injectable()
class CreateUserUseCase{


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){

    }

    async execute({admin, email, name, password}: IRequest){

        const userExists = await this.usersRepository.findByNameOrEmail({name, email})


        if(userExists){
            
            if(userExists.email === email){
                throw new AppError("There is a user with this email already")
            } 
            if(userExists.name === name){
                throw new AppError("This username is already taken")
            } 

        }

        const {hash, salt} = genPassword(password)

        const user = await this.usersRepository.save({
            admin,
            email,
            name,
            password_hash: hash, 
            salt
        })

        return user

    }

}

export{CreateUserUseCase}