"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { useBoardStore } from "../store/boardStore"
import CreateBoardModal from "../components/CreateBoardModal"
import BoardCard from "../components/BoardCard"
import Navbar from "../components/Navbar"
import axios from "axios"

export default function Dashboard() {
  const { user, logout } = useUserStore()
  const { boards, setBoards } = useBoardStore()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBoards(response.data)
    } catch (error) {
      console.error("Failed to fetch boards:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <Navbar user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-12 animate-slide-in-up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Your Boards</h1>
              <p className="text-slate-300">
                Welcome back, <span className="gradient-text font-semibold">{user?.name}</span>! Manage your
                collaboration workspace.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 gradient-bg-primary hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 hover-lift"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Board
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 gradient-bg-primary rounded-full blur opacity-50 animate-pulse"></div>
              <div className="absolute inset-0 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        ) : boards.length === 0 ? (
          <div className="card-premium text-center py-20 hover-lift animate-slide-in-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No boards yet</h3>
            <p className="text-slate-400 mb-6">Start your first collaboration by creating a board.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 gradient-bg-primary hover:shadow-lg text-white rounded-lg transition-all transform hover:scale-105"
            >
              Create Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, idx) => (
              <div key={board._id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-slide-in-up">
                <BoardCard board={board} onRefresh={fetchBoards} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onBoardCreated={() => {
            setShowModal(false)
            fetchBoards()
          }}
        />
      )}
    </div>
  )
}
