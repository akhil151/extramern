const activeUsers = {}

export const handleSocketConnection = (socket, io) => {
  console.log("User connected:", socket.id)

  // User joins board room
  socket.on("join-board", (boardId, userId) => {
    socket.join(`board-${boardId}`)
    if (!activeUsers[boardId]) {
      activeUsers[boardId] = []
    }
    activeUsers[boardId].push({ userId, socketId: socket.id })
    io.to(`board-${boardId}`).emit("user-joined", { userId, socketId: socket.id })
  })

  // User joins for profile updates
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`)
  })

  // Real-time card creation
  socket.on("card:create", (data) => {
    io.to(`board-${data.boardId}`).emit("card:created", data)
  })

  // Real-time card update
  socket.on("card:update", (data) => {
    io.to(`board-${data.boardId}`).emit("card:updated", data)
  })

  // Real-time card movement
  socket.on("card:move", (data) => {
    io.to(`board-${data.boardId}`).emit("card:moved", data)
  })

  // Real-time list creation
  socket.on("list:create", (data) => {
    io.to(`board-${data.boardId}`).emit("list:created", data)
  })

  // Real-time list update
  socket.on("list:update", (data) => {
    io.to(`board-${data.boardId}`).emit("list:updated", data)
  })

  // Real-time board creation
  socket.on("board:create", (data) => {
    io.to(`user-${data.userId}`).emit("board:created", data)
  })

  // Real-time board deletion
  socket.on("board:delete", (data) => {
    io.to(`user-${data.userId}`).emit("board:deleted", data)
  })

  // Real-time list deletion
  socket.on("list:delete", (data) => {
    io.to(`board-${data.boardId}`).emit("list:deleted", data)
    io.to(`user-${data.userId}`).emit("list:deleted", data)
  })

  // Real-time card deletion
  socket.on("card:delete", (data) => {
    io.to(`board-${data.boardId}`).emit("card:deleted", data)
    io.to(`user-${data.userId}`).emit("card:deleted", data)
  })

  // User disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
    for (const boardId in activeUsers) {
      activeUsers[boardId] = activeUsers[boardId].filter((user) => user.socketId !== socket.id)
      if (activeUsers[boardId].length === 0) {
        delete activeUsers[boardId]
      }
    }
  })
}
