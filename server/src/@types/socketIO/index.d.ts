import { Socket } from "socket.io"

interface ExtendedSocket extends Socket {

    user: {
        id: string,
        name: string,
        admin: boolean
    }


    
        
    // get request(): incomingMessage{
        
        
        
    // }
    
    
}

export{ExtendedSocket}