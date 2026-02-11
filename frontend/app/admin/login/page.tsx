"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowLeft, Eye, EyeOff, Pizza } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }

    setIsLoading(true)

    try {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("adminAuth", JSON.stringify({
          username,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }))

        toast.success("Kirish muvaffaqiyatli!")
        router.push("/admin")
      } else {
        toast.error("Noto'g'ri foydalanuvchi nomi yoki parol!")
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi!")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Bosh sahifaga qaytish
        </Link>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
          {/* Card Header with Logo */}
          <div className="text-center pt-8 pb-4 px-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 backdrop-blur-xl flex items-center justify-center border border-emerald-500/30">
              <Image src="/logo.png" alt="Pizza Centr Garden" width={56} height={56} className="rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              PIZZA CENTR GARDEN
            </h2>
            <p className="text-sm text-emerald-400 font-medium mt-1">Admin Panel</p>
            <p className="text-white/50 text-xs mt-2">
              Tizimga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          {/* Form */}
          <div className="p-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/80 text-sm font-medium">
                  Foydalanuvchi nomi
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl"
                  placeholder="admin"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                  Parol
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500 pr-10 h-12 rounded-xl"
                    placeholder="Parolingizni kiriting"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Kiring..." : "Kirish"}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-6">
          © 2018 — {new Date().getFullYear()} Pizza Centr Garden. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  )
}