import "reflect-metadata"



import express, {response} from "express";
import cors from "cors"

import * as ejs from "ejs"

import "express-async-errors"


import "./shared/container"
 
import "./database/index"

import "./shared/redis"

import { redisSession, wrapSessionForSocketIo } from "./shared/session/redisSession";

import {createServer} from "http"
import socketio, {Socket} from "socket.io"

import { redisClient } from "./shared/redis/config/redisConfig";

import router from "./routes/router";
import { errorHandler } from "./shared/erros/errorHandler";

import nunjucks from "nunjucks"

//se der ruim tirar
import methodOverride from "method-override"
import { ExtendedSocket} from "./@types/socketIO";
import { RedisMessageStore } from "./shared/redis/repositories/redisMessageStore";
import { v4 as uuidV4 } from "uuid";
import { RedisUserStore } from "./shared/redis/repositories/redisUserStore";


const app = express()

const httpServer = createServer(app)
const io = new socketio.Server(httpServer, {
    cors: {
        origin: "*"//"http://localhost:3000"//porta do que o react ta usando
    }
})

//front
app.use(express.static("public"))

app.use(methodOverride('_method'));//front

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))



nunjucks.configure("public/views", {
    express: app,
    autoescape: true,
    noCache: true
})
app.set("view engine", "njk")


app.use(redisSession)

io.use(wrapSessionForSocketIo(redisSession))




const redisMessageSotore = new RedisMessageStore()
const redisUserStore = new RedisUserStore()


io.use((socket: ExtendedSocket, next) => {

    //@ts-expect-error
    const user = socket.request.session.user

    if(!user){
        return next(new Error("Invalid user!"))
    }

    
    socket.user = user


    next()

})

io.on("connection", async (socket: ExtendedSocket) =>{
    
    //entra na propria sala
    socket.join(socket.user.id)

    //procurar o user / se nao tiver cria
    const user = await redisUserStore.findUser({id: socket.user.id}) || await redisUserStore.saveUser(socket.user)

    
    //procura todos os users online no namespace "/"
    const sockets = []
    io.of("/").sockets.forEach((socket: ExtendedSocket)=> {
        sockets.push({
            socket_id: socket.id, 
            user: socket.user,
            // messages: messagesPerUser.get(socket.user.id)
        })
        
    });
    
    //manda para o user todos os users que estão concectados
    socket.emit("users", sockets)

    // ve se tem notificaçoes
    const notifications = await redisUserStore.findNotificationsForUser({id: user.id})
    if(notifications || notifications.length){
        // mandar as notificações pra ele
        socket.emit("notifications", notifications)
    }

    //manda para todos, que o user conectou
    socket.broadcast.emit("user_connected", {
        socket_id: socket.id,
        user: socket.user,
    })

    //ouve o pedido das mensagens anteriores
    socket.on("request_previous_messages", async (data) => {

        //acha o outro user nnos sockets
        const otherUser = sockets.find(socket => socket.user.id === data.user_id);
            
        if(otherUser){
    
            //procura as msgs
            let messages = [];
            (await redisMessageSotore.findMessageForUser({id: user.id})).forEach((message) => {

                const {to, from} = message
        
                
                //pega apenas dos users da conversa
                if((to === otherUser.user.id || to === user.id) && (from === otherUser.user.id || from === user.id)){
                    
                   
                    if(to === user.id){

                        messages.push({
                            message: message.message, 
                            sender: {
                                id: user.id,
                                name: user.name
                            }
                        })
                        
                    }
                    if(to === otherUser.user.id){

                        messages.push({
                            message: message.message, 
                            sender: {
                                id: otherUser.user.id,
                                name: otherUser.user.name
                            }
                        })
                    }

                }

        
            })
                

            socket.emit("previous_messages", messages)
        }
    })


    //quando o evento for disparado pelo cliente no front end
    socket.on("send_message", (data) => {

        
        if(!data.receiver){

            socket.emit("emit_error", "user not found")
        }

        
        const messageObject = {
            
            message: data.message,
            to: data.sender.id,
            from: data.receiver.id
            //readed: false
        }

        
        // socket.broadcast.to(data.receiver).emit("emit_message", data)
        //(abaixo)manda para o sender e o receiver, resolve o problema do sender com duas abas abertas
        socket.to(data.sender.id).to(data.receiver.id).emit("emit_message", data)
        //
        //.broadcast.emit("emit_message", data)
        
        //salva a msg
        redisMessageSotore.saveMessage(messageObject)
        
    })



    socket.on("join_room", (room) => {
        
        socket.join(room)

    })

   

    socket.on("leave_room", (room) => {
        socket.leave(room)
    })

    socket.on("disconnect", async (reason) => {

            const matchingSockets = await io.in(socket.user.id).fetchSockets();
           
            const isDisconnected = matchingSockets.length === 0;
            
            //se nao ouver sockets nesse room vai emitir o user disconnected
            if (isDisconnected) {
            // // notify other users
                socket.broadcast.emit("user_disconnected", socket.user);
        
            }
        }
    )
    

})


app.use(router)

app.use(errorHandler)


export {app, httpServer, io}