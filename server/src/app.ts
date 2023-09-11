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


import router from "./routes/router";
import { errorHandler } from "./shared/erros/errorHandler";

import nunjucks from "nunjucks"

//se der ruim tirar
import methodOverride from "method-override"
import { ExtendedSocket} from "./@types/socketIO";


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

io.on("connection", (socket: ExtendedSocket) =>{
    
    //@ts-expect-error
    const user = socket.request.session.user

    socket.join(user.id)

    socket.broadcast.emit("user_connected", {
        socket_id: socket.id,
        user: socket.user,
    })


    let sockets = []
    for(let [id, socket] of io.of("/").sockets){
        
        sockets.push({
            socket_id: id, 
            //@ts-expect-error
            user: socket.user
        })

    }
    
   
    socket.emit("users", sockets)
    

    // socket.emit("previous_messages", temporario)

    //quando o evento for disparado pelo cliente no front end
    socket.on("send_message", (data) => {
        
        // temporario.push(data)

        
        // o socker(client) vai emitir esse mesmo evento para todos menos ele mesmo
        //usar o room depois
        if(!data.receiver){

            socket.emit("emit_error", "user not found")
        }


        // socket.broadcast.to(data.receiver).emit("emit_message", data)
        //(abaixo)manda para o sender e o receiver, resolve o problema do sender com duas abas abertas
        socket.to(data.sender.id).to(data.receiver).emit("emit_message", data)
        //
        //.broadcast.emit("emit_message", data)
    })

    

    socket.on("join_room", (room) => {
        
        socket.join(room)

    })

    // socket.to().broadcast.emit("emit_message", )

    socket.on("leave_room", (room) => {
        socket.leave(room)
    })

    socket.on("disconnect", (reason) => {

        io.emit("user_disconnected", {user: user})
    })
    

})


app.use(router)

app.use(errorHandler)


export {app, httpServer, io}