import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { useBoardStore } from "../store/boardStore"
import CreateBoardModal from "../components/CreateBoardModal"
import LearnMoreModal from "../components/LearnMoreModel"
import BoardCard from "../components/BoardCard"
import Navbar from "../components/Navbar"
import { Sparkles, Zap, Share2 } from "lucide-react"
import axios from "axios"

export default function Dashboard() {
  const { user, logout } = useUserStore()
  const { boards, setBoards } = useBoardStore()
  const [showModal, setShowModal] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/boards`, {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
        {/* Hero Section */}
        <div className="mb-16 animate-slide-in-up">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-semibold">Welcome Back!</span>
              </div>
              <h1 className="text-5xl font-bold mb-3">
                Hi, <span className="text-white/90">{user?.name}</span>
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Create, collaborate, and manage your projects in real-time with your team.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-white text-purple-600 font-bold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Create New Board
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
            <div className="text-4xl font-bold gradient-text mb-2">{boards.length}</div>
            <p className="text-slate-600 font-semibold">Active Boards</p>
            <p className="text-sm text-slate-400 mt-2">Collaborate with your team</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-cyan-600 mb-2">
              {boards.reduce((acc, b) => acc + (b.lists?.length || 0), 0)}
            </div>
            <p className="text-slate-600 font-semibold">Total Lists</p>
            <p className="text-sm text-slate-400 mt-2">Organized workflows</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-pink-600 mb-2">{user?.name}</div>
            <p className="text-slate-600 font-semibold">Team Member</p>
            <p className="text-sm text-slate-400 mt-2">Premium Collaborator</p>
          </div>
        </div>

        {/* Boards Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Your Boards</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              New Board
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : boards.length === 0 ? (
            <div className="bg-white rounded-2xl p-20 text-center shadow-lg border border-slate-200">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No boards yet</h3>
              <p className="text-slate-600 mb-8">Start your first collaboration by creating a board.</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Create First Board
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Share2 className="w-6 h-6" />
            <span className="text-sm font-semibold">Invite Your Team</span>
          </div>
          <h3 className="text-3xl font-bold mb-3">Collaborate in Real-Time</h3>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Share board URLs with your teammates and see changes happen instantly. No complex permissions needed.
          </p>
          <button
            onClick={() => setShowLearnMore(true)}
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Learn More
          </button>
        </div>
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

      {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
    </div>
  )
}
