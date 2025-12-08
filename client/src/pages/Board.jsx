"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import Navbar from "../components/Navbar"
import BoardList from "../components/BoardList"
import CardModal from "../components/CardModal"
import axios from "axios"
import io from "socket.io-client"
import Sidebar from "../components/Sidebar"

export default function Board() {
  const { id } = useParams()
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState(null)
  const [socket, setSocket] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchBoard()
  }, [id, user, navigate])

  useEffect(() => {
    if (!user?.id) return

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
    console.log("[v0] Connecting to socket at:", socketUrl)

    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on("connect", () => {
      console.log("[v0] Socket connected:", newSocket.id)
      newSocket.emit("join-board", id, user?.id)
    })

    newSocket.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [id, user?.id])

  useEffect(() => {
    if (!socket) return

    socket.on("card:created", () => {
      console.log("[v0] Card created event received")
      fetchBoard()
    })
    socket.on("card:updated", () => {
      console.log("[v0] Card updated event received")
      fetchBoard()
    })
    socket.on("card:moved", () => {
      console.log("[v0] Card moved event received")
      fetchBoard()
    })
    socket.on("list:created", () => {
      console.log("[v0] List created event received")
      fetchBoard()
    })

    return () => {
      socket.off("card:created")
      socket.off("card:updated")
      socket.off("card:moved")
      socket.off("list:created")
    }
  }, [socket])

  const fetchBoard = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setBoard(response.data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch board:", error)
      setError(error.response?.data?.message || "Failed to load board")

      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/20 to-pink-900/20"></div>
        </div>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 gradient-bg-primary rounded-full blur opacity-50 animate-pulse"></div>
          <div className="absolute inset-0 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="card-premium text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 gradient-bg-primary text-white rounded-lg hover:scale-105 transition-transform"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar boardTitle={board?.title} user={user} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} onLogout={logout} boardTitle={board?.title} />

          {/* Board Canvas */}
          <div className="flex-1 overflow-auto relative">
            <div className="w-full h-full p-8">
              {board && <BoardList board={board} socket={socket} onRefresh={fetchBoard} />}
            </div>
          </div>
        </div>
      </div>

      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} onUpdate={fetchBoard} />}
    </div>
  )
}
