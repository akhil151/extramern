"use client"

import { useState } from "react"
import axios from "axios"

export default function CreateCardForm({ listId, boardId, onClose, onCreated }) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cards`,
        { title, list: listId, board: boardId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onCreated()
    } catch (error) {
      console.error("Failed to create card:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-4 space-y-3 border border-white/10 animate-slide-in-up">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a card..."
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all text-sm font-semibold"
        autoFocus
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 gradient-bg-primary hover:shadow-lg text-white rounded-lg text-sm font-semibold transition-all transform hover:scale-105 disabled:opacity-50 active:scale-95"
        >
          {loading ? "Adding..." : "Add Card"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 glass hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-sm font-semibold transition-all border border-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
