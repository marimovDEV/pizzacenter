"use client"

import { useState, useMemo } from "react"
import {
    Search,
    Filter,
    Clock,
    CheckCircle2,
    Timer,
    XCircle,
    ChevronRight,
    RefreshCcw,
    User,
    Hash,
    ShoppingBag,
    MoreVertical,
    UtensilsCrossed
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAdminOrders, useApiClient } from "@/hooks/use-api"
import { Order, OrderItem } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function OrdersTab() {
    const { orders, loading, refetch } = useAdminOrders()
    const api = useApiClient()

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null)

    const filteredOrders = useMemo(() => {
        let filtered = [...orders]

        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter)
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(order =>
                order.id.toString().includes(query) ||
                order.customer_name?.toLowerCase().includes(query) ||
                order.table_number?.toString().includes(query)
            )
        }

        return filtered
    }, [orders, searchQuery, statusFilter])

    const handleStatusUpdate = async (orderId: number, newStatus: Order["status"]) => {
        setIsUpdatingStatus(orderId)
        try {
            await api.patch(`/orders/${orderId}/status/`, { status: newStatus })
            toast.success("Buyurtma holati yangilandi")
            refetch()
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
            }
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Xatolik yuz berdi")
        } finally {
            setIsUpdatingStatus(null)
        }
    }

    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "pending": return <Clock className="w-4 h-4 text-amber-500" />
            case "preparing": return <RefreshCcw className="w-4 h-4 text-blue-500 animate-spin-slow" />
            case "ready": return <Timer className="w-4 h-4 text-emerald-500" />
            case "served": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />
        }
    }

    const getStatusLabel = (status: Order["status"]) => {
        switch (status) {
            case "pending": return "Kutilmoqda"
            case "preparing": return "Tayyorlanmoqda"
            case "ready": return "Tayyor"
            case "served": return "Topshirildi"
            case "cancelled": return "Bekor qilindi"
        }
    }

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
            case "preparing": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "ready": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            case "served": return "bg-slate-500/10 text-slate-400 border-slate-500/20"
            case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Buyurtmalar</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refetch}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                        <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                        Yangilash
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                        placeholder="ID, mijoz yoki stol raqami..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500/50"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-white/40" />
                            <SelectValue placeholder="Holat" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="all" className="text-white">Barcha holatlar</SelectItem>
                        <SelectItem value="pending" className="text-white">Kutilmoqda</SelectItem>
                        <SelectItem value="preparing" className="text-white">Tayyorlanmoqda</SelectItem>
                        <SelectItem value="ready" className="text-white">Tayyor</SelectItem>
                        <SelectItem value="served" className="text-white">Topshirildi</SelectItem>
                        <SelectItem value="cancelled" className="text-white">Bekor qilindi</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {loading && orders.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <RefreshCcw className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40">Buyurtmalar topilmadi</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-white font-bold">{order.customer_name || "Mijoz"}</h3>
                                            <span className="text-xs text-white/40">•</span>
                                            <span className="text-xs text-white/60 font-medium">Stol #{order.table_number}</span>
                                        </div>
                                        <p className="text-xs text-white/40 mt-0.5">
                                            {format(new Date(order.created_at), "HH:mm, d-MMM")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-emerald-400 font-black">{formatPrice(order.total)}</p>
                                        <p className="text-[10px] text-white/40">{order.items.length} xil mahsulot</p>
                                    </div>

                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-2",
                                        getStatusColor(order.status)
                                    )}>
                                        {getStatusIcon(order.status)}
                                        {getStatusLabel(order.status)}
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between mt-2">
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                        <UtensilsCrossed className="w-6 h-6 text-emerald-500" />
                                        Buyurtma #{selectedOrder.id}
                                    </DialogTitle>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2",
                                        getStatusColor(selectedOrder.status)
                                    )}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {getStatusLabel(selectedOrder.status)}
                                    </div>
                                </div>
                                <DialogDescription className="text-white/40 mt-1">
                                    {format(new Date(selectedOrder.created_at), "eeee, d-MMMM, HH:mm")}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-6">
                                {/* Info Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold mb-2">
                                            <User className="w-3 h-3" /> Mijoz Ma'lumotlari
                                        </div>
                                        <p className="text-white font-bold">{selectedOrder.customer_name || "Ism ko'rsatilmagan"}</p>
                                        <p className="text-xs text-white/60 mt-1">Stol raqami: {selectedOrder.table_number}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold mb-2">
                                            <Hash className="w-3 h-3" /> Moliyaviy
                                        </div>
                                        <p className="text-emerald-400 font-black text-lg">{formatPrice(selectedOrder.total)}</p>
                                        <p className="text-xs text-white/60 mt-0.5">{selectedOrder.items.length} ta mahsulot</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white/80">Mahsulotlar ro'yxati</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-sm">
                                                        {item.quantity}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{item.menu_item_name_uz || item.menu_item_name}</p>
                                                        {item.notes && <p className="text-[10px] text-amber-400 mt-0.5 italic">"{item.notes}"</p>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white">{formatPrice(item.total_price)}</p>
                                                    <p className="text-[10px] text-white/40">{formatPrice(item.price)} / ta</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                        <p className="text-amber-500 text-xs font-bold uppercase mb-1">Buyurtma uchun eslatma:</p>
                                        <p className="text-white/80 text-sm italic">"{selectedOrder.notes}"</p>
                                    </div>
                                )}

                                {/* Status Actions */}
                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-xs font-bold text-white/40 uppercase mb-3">Holatni o'zgartirish</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(["pending", "preparing", "ready", "served", "cancelled"] as Order["status"][]).map(status => (
                                            <Button
                                                key={status}
                                                onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                                                disabled={selectedOrder.status === status || isUpdatingStatus === selectedOrder.id}
                                                className={cn(
                                                    "h-10 rounded-xl font-bold px-4 transition-all flex items-center gap-2",
                                                    selectedOrder.status === status
                                                        ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default"
                                                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                                                )}
                                            >
                                                {getStatusIcon(status)}
                                                {getStatusLabel(status)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
