"use client"

import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function BoardCard({ board, onRefresh }) {
  const navigate = useNavigate()

  const boardGradients = [
    "from-purple-600/20 to-purple-400/10 hover:from-purple-600/40 hover:to-purple-400/20 border-purple-500/30 hover:border-purple-400/60",
    "from-cyan-600/20 to-cyan-400/10 hover:from-cyan-600/40 hover:to-cyan-400/20 border-cyan-500/30 hover:border-cyan-400/60",
    "from-pink-600/20 to-pink-400/10 hover:from-pink-600/40 hover:to-pink-400/20 border-pink-500/30 hover:border-pink-400/60",
    "from-emerald-600/20 to-emerald-400/10 hover:from-emerald-600/40 hover:to-emerald-400/20 border-emerald-500/30 hover:border-emerald-400/60",
  ]

  const gradient = boardGradients[board._id?.charCodeAt(0) % 4] || boardGradients[0]

  const handleDelete = async (e) => {
    e.stopPropagation()

    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${import.meta.env.VITE_API_URL}/boards/${board._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        onRefresh()
      } catch (error) {
        console.error("Failed to delete board:", error)
      }
    }
  }

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover-lift group border bg-gradient-to-br ${gradient} animate-slide-in-up`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
            {board.title}
          </h3>
          <p className="text-slate-400 text-sm mt-2 line-clamp-2">{board.description || "No description"}</p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 text-red-400 hover:bg-red-500/20 hover:scale-110 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 group-hover:scale-125 transition-transform"></div>
          <span className="text-slate-400 text-xs font-semibold">{board.lists?.length || 0} Lists</span>
        </div>
        <div className="flex -space-x-2">
          {board.members?.slice(0, 3).map((member) => (
            <div
              key={member._id}
              className="w-7 h-7 rounded-full border-2 border-slate-900 bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform"
              title={member.name}
            >
              {member.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {board.members?.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-slate-700/50 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform">
              +{board.members.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
