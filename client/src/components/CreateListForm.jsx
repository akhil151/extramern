"use client"

import { useState } from "react"
import axios from "axios"

export default function CreateListForm({ boardId, onClose, onCreated }) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/lists`,
        { title, board: boardId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onCreated()
    } catch (error) {
      console.error("Failed to create list:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6 space-y-4 border border-white/10 animate-slide-in-up"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="List title..."
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all text-sm font-semibold"
        autoFocus
        required
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 gradient-bg-accent hover:shadow-lg text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 active:scale-95"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 glass hover:bg-white/10 text-slate-300 hover:text-white rounded-lg font-semibold transition-all border border-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
