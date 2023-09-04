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

//se der ruim tirar
import methodOverride from "method-override"


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

app.set("views", "public/views")
app.engine("html", ejs.renderFile)
app.set("view engine", "html")


app.use(redisSession)

io.use(wrapSessionForSocketIo(redisSession))

//substituir pelo redis
let temporario = []

io.on("connection", (socket: Socket) =>{
    
    //@ts-expect-error
    console.log(socket.request.session)

    socket.emit("previous_messages", temporario)

    //quando o evento for disparado pelo cliente no front end
    socket.on("send_message", (data) => {
        
        temporario.push(data)

        
        // o socker(client) vai emitir esse mesmo evento para todos menos ele mesmo
        //usar o room depois
        socket.broadcast.emit("emit_message", data)
    })

    
    
    // //@ts-expect-error
    // const user = socket.request.session.user //|| uuidV4()


    

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


export {app, httpServer, io}