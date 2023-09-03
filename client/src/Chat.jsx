import React, { useEffect, useState } from "react";

import io from "socket.io-client"

//temporario
import { v4 as uuidV4 } from "uuid"
const myId = uuidV4()


const socket = io("http://localhost:3333")

socket.on("connect", () => console.log("[IO] Connect => A new connection has been established."))

const Chat = () => {


    const [message, updateMessage] = useState("")

    const [messages, updateMessages] = useState([])

    useEffect(() => {
        const handleNewMessage = newMessage => updateMessages([...messages, newMessage])

        socket.on("new.message", handleNewMessage)

        return () => socket.off("new.message", handleNewMessage)

    }, [messages])

    const handleFormSubmit = event => {
        event.preventDefault()

        if (message.trim()) {


            socket.emit("new.message", {
                id: myId,
                message
            })

            updateMessage("")
        }
    }

    const handleInputChange = event => updateMessage(event.target.value)

    return (
        <main className="container">

            <ul className="list">

                {messages.map((m, index) => (

                    <li
                        className={`list__item list__item--${m.id === myId ? "mine" : "other"}`}
                        key={index}
                    >

                        <span className={`message message--${m.id === myId ? "mine" : "other"}`}>
                            {m.message}
                        </span>

                    </li>

                ))}

            </ul>

            <form className="form" onSubmit={handleFormSubmit}>
                <input
                    className="form__field"
                    onChange={handleInputChange}
                    placeholder="Type a new message here"
                    type="text"
                    value={message}
                />
            </form>
        </main>
    )

}

export default Chat