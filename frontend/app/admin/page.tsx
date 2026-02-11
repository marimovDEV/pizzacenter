"use client"
import { ArrowLeft, Package, Tag, Megaphone, MessageSquare, LogOut } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoriesTab } from "@/components/admin/categories-tab"
import { MenuItemsTab } from "@/components/admin/menu-items-tab"
import { PromotionsTab } from "@/components/admin/promotions-tab"
import { ErrorBoundary } from "@/components/admin/error-boundary"
import { AuthGuard } from "@/components/admin/auth-guard"
import { toast } from "sonner"
import { useState } from "react"
import Image from "next/image"

function AdminPanelContent() {
  const [activeTab, setActiveTab] = useState("categories")

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminAuth")
    }
    toast.success("Chiqish muvaffaqiyatli!")
    window.location.href = "/admin/login"
  }


  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-40 pointer-events-none" />
        <div className="relative z-10">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </Link>
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-full" />
                    <div>
                      <h1 className="text-sm font-bold text-white leading-tight">PIZZA CENTR</h1>
                      <p className="text-[10px] text-emerald-400 font-medium leading-tight">Admin Panel</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-full bg-red-500/20 backdrop-blur-xl flex items-center justify-center hover:bg-red-500/30 transition-all border border-red-500/30"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="px-4 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${activeTab === "categories"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
              >
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">Kategoriyalar</span>
              </button>

              <button
                onClick={() => setActiveTab("items")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${activeTab === "items"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Taomlar</span>
              </button>

              <button
                onClick={() => setActiveTab("promotions")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${activeTab === "promotions"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
              >
                <Megaphone className="w-4 h-4" />
                <span className="text-sm font-medium">Aksiyalar</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-4 pb-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

              <TabsContent value="categories">
                <ErrorBoundary>
                  <CategoriesTab />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="items">
                <ErrorBoundary>
                  <MenuItemsTab />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="promotions">
                <ErrorBoundary>
                  <PromotionsTab />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPanelContent />
    </AuthGuard>
  )
}
