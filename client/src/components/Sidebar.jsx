"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Layout, Palette, Type, Shapes, ImageIcon, Link2, MessageCircle, HelpCircle, LogOut } from "lucide-react"

export default function Sidebar({ boardTitle, user }) {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState("board")
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

  const menuItems = [
    { id: "board", icon: Layout, label: "Board", color: "from-blue-500 to-cyan-500" },
    { id: "design", icon: Palette, label: "Design", color: "from-purple-500 to-pink-500" },
    { id: "text", icon: Type, label: "Text", color: "from-orange-500 to-red-500" },
    { id: "shapes", icon: Shapes, label: "Shapes", color: "from-green-500 to-emerald-500" },
    { id: "image", icon: ImageIcon, label: "Image", color: "from-indigo-500 to-blue-500" },
    { id: "connection", icon: Link2, label: "Connect", color: "from-pink-500 to-rose-500" },
    { id: "comment", icon: MessageCircle, label: "Comment", color: "from-yellow-500 to-orange-500" },
  ]

  return (
    <div className="relative h-screen">
      <div className="w-20 h-screen bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col items-center py-4 gap-3 sticky left-0 top-0 overflow-y-auto shadow-2xl hover:w-64 transition-all duration-300 group z-50">
        {/* Logo/Brand */}
        <div
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/40 flex-shrink-0"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-white font-bold text-2xl">CB</span>
        </div>

        {/* Menu Items Container */}
        <div className="flex flex-col gap-2 flex-1 w-full px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full group/btn flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-purple-500/50`
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover/btn:scale-110" />
                  <span className="hidden md:inline text-sm font-medium whitespace-nowrap">{item.label}</span>
                </button>

                {/* Desktop Tooltip - Hidden on expanded */}
                {!isExpanded && hoveredItem === item.id && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-950 text-white text-xs rounded-lg opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-xl z-50">
                    {item.label}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-950 border-l border-t border-slate-700 transform rotate-45"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 w-full px-2 border-t border-slate-700/50 pt-2">
          <button
            className="w-full group/btn flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl bg-slate-700/30 hover:bg-slate-600/50 text-slate-400 hover:text-blue-400 transition-all duration-300"
            title="Help"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:inline text-sm font-medium">Help</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token")
              navigate("/login")
            }}
            className="w-full group/btn flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl bg-slate-700/30 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
