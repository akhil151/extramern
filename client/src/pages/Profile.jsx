"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { ArrowLeft, Mail, Calendar, Zap } from "lucide-react"
import axios from "axios"

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ boards: 0, lists: 0, cards: 0 })

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchProfile()
    fetchStats()
  }, [user, navigate])

  const fetchProfile = () => {
    setProfile(user)
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col items-center -mt-16 mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mt-6 text-center">{profile?.name}</h1>
              <p className="text-slate-500 text-center mt-2">Collaborator</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.boards}</div>
                <p className="text-slate-600 text-sm mt-2">Boards</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.lists}</div>
                <p className="text-slate-600 text-sm mt-2">Lists</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-pink-600">{stats.cards}</div>
                <p className="text-slate-600 text-sm mt-2">Cards</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Account Information</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email Address</p>
                    <p className="text-slate-900 font-semibold">{profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="text-slate-900 font-semibold">{new Date(profile?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Account Status</p>
                    <p className="text-slate-900 font-semibold">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
