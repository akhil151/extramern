import io from "socket.io-client"

let socket = null

export const connectSocket = (url = "http://localhost:5000") => {
  if (!socket) {
    socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const emitEvent = (eventName, data) => {
  if (socket) {
    socket.emit(eventName, data)
  }
}

export const onEvent = (eventName, callback) => {
  if (socket) {
    socket.on(eventName, callback)
  }
}
