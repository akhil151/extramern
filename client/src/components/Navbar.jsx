"use client"

import { useNavigate } from "react-router-dom"

export default function Navbar({ user, onLogout, boardTitle }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-full mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/dashboard")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CB</span>
                </div>
                <span className="text-2xl font-bold gradient-text">CollabBoard</span>
              </div>
            </div>
            {boardTitle && (
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  {boardTitle}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-800 text-sm font-semibold">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 font-semibold border border-slate-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
