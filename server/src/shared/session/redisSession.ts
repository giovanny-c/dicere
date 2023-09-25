import "dotenv/config"

import { redisClient } from "../redis/config/redisConfig"

import RedisStore from "connect-redis"

import session from "express-session"

import { Socket } from "socket.io"
import { NextFunction } from "express"




const redisSession = session({
    secret: process.env.SESSION_SECRET as string,
    store: new RedisStore({
        client: redisClient
    }),
    resave: true, //atualiza o cookie quando for feito um request pelo client
    rolling: true, //enquanto resave for true nao vai permitir que a sessao 'morra' se o use estiver ativo
    saveUninitialized: true, //se true salva sessoes vazias, de usuarios nao logados 

    cookie:{
        secure: false,
        httpOnly: true,
        maxAge: 1000*60*60*24*5// 5 dias
    }
})

const wrapSessionForSocketIo = expressMiddleware => (socket: Socket, next: NextFunction) => expressMiddleware(socket.request, {}, next)

export {redisSession, wrapSessionForSocketIo}