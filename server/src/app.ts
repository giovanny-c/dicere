import "reflect-metadata"



import express, {response} from "express";
import cors from "cors"

import * as ejs from "ejs"

import "express-async-errors"


import "./shared/container"
 
import "./database/index"

import "./shared/redis/redisConnect"

import { redisSession, wrapSessionForSocketIo } from "./shared/session/redisSession";

import {createServer} from "http"
import socketio, {Socket} from "socket.io"

import { redisClient } from "./shared/redis/redisConfig";

import router from "./routes/router";
import { errorHandler } from "./shared/erros/errorHandler";

import nunjucks from "nunjucks"

//se der ruim tirar
import methodOverride from "method-override"
import { ExtendedSocket} from "./@types/socketIO";
import { RedisMessageSotore } from "./shared/redis/redisMessageStore";
import { v4 as uuidV4 } from "uuid";


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





io.use((socket: ExtendedSocket, next) => {

    //@ts-expect-error
    const user = socket.request.session.user

    if(!user){
        return next(new Error("Invalid user!"))
    }

    
    socket.user = user


    next()

})


const redisMessageSotore = new RedisMessageSotore()

io.on("connection", async (socket: ExtendedSocket) =>{
    
   
    socket.join(socket.user.id)

    

    socket.broadcast.emit("user_connected", {
        socket_id: socket.id,
        user: socket.user,
    })


    const sockets = []
    // const conversation_messages = new Map()


    io.of("/").sockets.forEach((socket: ExtendedSocket)=> {
        sockets.push({
            socket_id: socket.id, 
            user: socket.user,
            // messages: messagesPerUser.get(socket.user.id)
        })

    });

    socket.emit("users", sockets)

    // //notifica o user, quais users mandaram msg pra ele enquanto ele estava ofline
    // const {from_users} = socket.data.unreaded_message_users
    // socket.emit("unread_messages_from", from_users)
    
    

    socket.on("request_previous_messages", async (data) => {

        //acha o outro user nnos sockets
        const otherUser = sockets.find(socket => socket.user.id === data.user_id);
            
        if(otherUser){

            
            //procura as msgs
            let messages = [];
            
            (await redisMessageSotore.findMessageForUser(socket.user.id)).forEach((message) => {

                

                const {to, from} = message
        
                
                //pega apenas dos users da conversa
                if((to === otherUser.user.id || to === socket.user.id) && (from === otherUser.user.id || from === socket.user.id)){
                    
                   
                    if(to === socket.user.id){

                        messages.push({
                            message: message.message, 
                            sender: {
                                id: socket.user.id,
                                name: socket.user.name
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
        
        

        // data: {
        //     sender: {id, name},
        //     receiver: {id},
        //     message
        // }

        
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



    // socket.on("message_not_readed", (data) => {

    //     socket.data.unreaded_message_users.push(data.from)

    // })
    

    socket.on("join_room", (room) => {
        
        socket.join(room)

    })

    // socket.to().broadcast.emit("emit_message", )

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