import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/erros/AppError";
import { socketHandler } from "../../../../app";
import { response } from "express";


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

        const senderExists = await this.usersRepository.findById({id: sender_id})

        const receiverExists = await this.usersRepository.findById({id: receiver_id})

        if(!senderExists) throw new AppError("Usuario emissor não encontrado.", 400)
        if(!receiverExists) throw new AppError("Usuario não encontrado ou não existe.", 400)

        //procura o user no room do receiver_id
        const sockets = await socketHandler.fetchSockets()

        const receiver = sockets.map(socket => {
            //@ts-expect-error
            if(socket.user.id === receiver_id){
                return socket
            }
            
        })

        console.log(sockets)
        console.log(receiver)

        //checa se o receiver existe
        if(!receiver){
            throw new AppError("Usuario não encontrado", 500)
        }

        const message_object = {
            message,
            sender: senderExists,
            time: time || null // por enquanto
        }

        //como mandar por outro user (pelo socket do sender, nao pelo socket do servidor)?
        socketHandler.to(receiver_id).emit("message", { message_object })



        return 


    }

}

export {SendMessageUseCase}