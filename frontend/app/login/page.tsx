"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAdmin", "true")
      toast.success("Muvaffaqiyatli kirdingiz!")
      router.push("/admin")
    } else {
      toast.error("Login yoki parol noto'g'ri!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="relative w-full">
        <div className="absolute inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center opacity-40" />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Login</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Image src="/logo.png" alt="Pizza Centr Garden" width={48} height={48} className="rounded-full" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-white mb-2 block">
                  <User className="w-4 h-4 inline mr-2" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/10 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 h-12 rounded-xl"
                  placeholder="admin"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white mb-2 block">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 h-12 rounded-xl"
                  placeholder="••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg shadow-emerald-500/30"
              >
                Kirish
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
