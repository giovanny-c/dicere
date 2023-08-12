import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/erros/AppError";
import { socketHandler } from "../../../../app";


interface IRequest{
    sender_id: string
    receiver_id: string
    message: string
    time?: Date
}

@injectable()
class SendMessageUseCase{

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){

    }

    async execute({message, receiver_id, sender_id, time}: IRequest){

        const senderExists = this.usersRepository.findById({id: sender_id})

        const receiverExists = this.usersRepository.findById({id: receiver_id})

        if(!senderExists) throw new AppError("Usuario emissor não encontrado.", 400)
        if(!receiverExists) throw new AppError("Usuario não encontrado ou não existe.", 400)

        //como enviar para o user
        // socketHandler.to()

    }

}

export {SendMessageUseCase}