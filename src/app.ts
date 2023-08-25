import "reflect-metadata"



import express, {response} from "express";
import cors from "cors"

import "express-async-errors"

import "./shared/containers" 

import "./database/index"

import "./shared/redis/redisConnect"

import { redisSession, wrapSessionForSocketIo } from "./shared/session/redisSession";

import {createServer} from "http"
import socketio, {Socket} from "socket.io"

import {v4 as uuidV4} from "uuid"
import router from "./routes/router";
import { errorHandler } from "./shared/erros/errorHandler";

const app = express()

const httpServer = createServer(app)
const socketHandler = new socketio.Server(httpServer)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(redisSession)

socketHandler.use(wrapSessionForSocketIo(redisSession))

socketHandler.on("connection", (socket: Socket) =>{
    
    
    
    
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