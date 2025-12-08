"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import ListColumn from "./ListColumn"
import CreateListForm from "./CreateListForm"
import axios from "axios"

export default function BoardList({ board, socket, onRefresh }) {
  const [showCreateList, setShowCreateList] = useState(false)

  const handleDragEnd = async (result) => {
    const { source, destination, type, draggableId } = result

    console.log("[v0] Drag ended:", { source, destination, type, draggableId })

    if (!destination) {
      console.log("[v0] No destination, ignoring drag")
      return
    }

    if (source.index === destination.index && source.droppableId === destination.droppableId) {
      console.log("[v0] Same position, ignoring drag")
      return
    }

    if (type === "list") {
      console.log("[v0] Reordering lists")
      const listIds = board.lists?.map((l) => l._id) || []
      const newListIds = Array.from(listIds)
      newListIds.splice(source.index, 1)
      newListIds.splice(destination.index, 0, listIds[source.index])

      try {
        const token = localStorage.getItem("token")
        await axios.post(
          `${import.meta.env.VITE_API_URL}/lists/reorder`,
          { lists: newListIds },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (socket) socket.emit("list:update", { boardId: board._id })
        onRefresh()
      } catch (error) {
        console.error("[v0] Failed to reorder lists:", error)
      }
    } else if (type === "card") {
      console.log("[v0] Moving card between lists")
      const fromListId = source.droppableId
      const toListId = destination.droppableId

      try {
        const token = localStorage.getItem("token")
        await axios.post(
          `${import.meta.env.VITE_API_URL}/cards/${draggableId}/move`,
          {
            fromList: fromListId,
            toList: toListId,
            position: destination.index,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (socket) socket.emit("card:move", { boardId: board._id })
        onRefresh()
      } catch (error) {
        console.error("[v0] Failed to move card:", error)
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="list" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 pb-6 overflow-x-auto scroll-smooth"
            style={{
              background: snapshot.isDraggingOver
                ? "linear-gradient(to right, rgba(252, 211, 77, 0.1), rgba(244, 114, 182, 0.1))"
                : "transparent",
              transition: "background 0.2s ease",
            }}
          >
            {board?.lists && board.lists.length > 0 ? (
              board.lists.map((list, index) => {
                const listColors = [
                  "bg-yellow-50 border-yellow-300/40 shadow-lg shadow-yellow-200/20",
                  "bg-pink-50 border-pink-300/40 shadow-lg shadow-pink-200/20",
                  "bg-green-50 border-emerald-300/40 shadow-lg shadow-emerald-200/20",
                  "bg-blue-50 border-blue-300/40 shadow-lg shadow-blue-200/20",
                ]
                const colorClass = listColors[index % 4]

                return (
                  <Draggable key={list._id} draggableId={list._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        className={`flex-shrink-0 w-96 ${snapshot.isDragging ? "opacity-50 scale-95" : ""}`}
                      >
                        <ListColumn
                          list={list}
                          boardId={board._id}
                          socket={socket}
                          onRefresh={onRefresh}
                          colorClass={colorClass}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })
            ) : (
              <div className="w-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-slate-500 font-semibold">No lists yet. Create one to get started!</p>
                </div>
              </div>
            )}
            {provided.placeholder}

            {/* Add List Button */}
            <div className="flex-shrink-0 w-96">
              {showCreateList ? (
                <div className="animate-slide-in-up">
                  <CreateListForm
                    boardId={board._id}
                    onClose={() => setShowCreateList(false)}
                    onCreated={() => {
                      setShowCreateList(false)
                      onRefresh()
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowCreateList(true)}
                  className="w-full h-full min-h-80 rounded-3xl p-6 text-slate-600 font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-3 group bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-dashed border-slate-400 hover:border-slate-500 hover:bg-slate-100"
                >
                  <svg
                    className="w-10 h-10 group-hover:scale-125 transition-transform duration-300 text-slate-500 group-hover:text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div>
                    <p className="font-bold text-slate-700">Add List</p>
                    <p className="text-xs text-slate-500 mt-1">Create new column</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
