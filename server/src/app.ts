import "reflect-metadata"



import express, {response} from "express";
import cors from "cors"

import "express-async-errors"


import "./shared/container"
 
import "./database/index"

import "./shared/redis/redisConnect"

import { redisSession, wrapSessionForSocketIo } from "./shared/session/redisSession";

import {createServer} from "http"
import socketio, {Socket} from "socket.io"

import {v4 as uuidV4} from "uuid"
import router from "./routes/router";
import { errorHandler } from "./shared/erros/errorHandler";

//se der ruim tirar
import methodOverride from "method-override"


const app = express()

const httpServer = createServer(app)
const socketHandler = new socketio.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"//porta do que o react ta usando
    }
})

//front
app.use(express.static("public"))

app.use(methodOverride('_method'));//front

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(redisSession)

socketHandler.use(wrapSessionForSocketIo(redisSession))

socketHandler.on("connection", (socket: Socket) =>{
    
    console.log("[IO] Connection => Server has a new connection")

    //quando o evento for disparado pelo cliente no front end
    socket.on("new.message", (data) => {
        console.log(`[SOCKET] new.message =>`, data)

        // o servidor vai emitir esse mesmo evento para todos
        socketHandler.emit("new.message", data)
    })

    
    
    // //@ts-expect-error
    // const user = socket.request.session.user //|| uuidV4()
    
    //@ts-expect-error
    console.log(socket.request.session)
    console.log(socket.id)

    

    // if(!user){
    //     user.id = uuidV4()
    //     user.name = "anonymous"
    // }

    // //@ts-expect-error
    // socket.user = user

    //join room of its id
    // socket.join(user.id)
})


app.use(router)

app.use(errorHandler)


export {app, httpServer, socketHandler}