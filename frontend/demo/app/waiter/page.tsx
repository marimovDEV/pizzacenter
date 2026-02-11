"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Clock, CheckCircle, ChefHat, Utensils, RefreshCw, User } from "lucide-react"
import { getStoredOrders, updateOrderStatus, formatPrice, type Order } from "@/lib/restaurant-data"

export default function WaiterPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [language, setLanguage] = useState<"en" | "uz">("uz")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Load orders from localStorage
  const loadOrders = () => {
    const storedOrders = getStoredOrders()
    setOrders(storedOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    setLastRefresh(new Date())
  }

  useEffect(() => {
    loadOrders()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus)
    loadOrders()
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-green-500"
      case "served":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    const statusTexts = {
      pending: language === "uz" ? "Kutilmoqda" : "Pending",
      preparing: language === "uz" ? "Tayyorlanmoqda" : "Preparing",
      ready: language === "uz" ? "Tayyor" : "Ready",
      served: language === "uz" ? "Berildi" : "Served",
    }
    return statusTexts[status]
  }

  const getOrdersByStatus = (status: Order["status"]) => {
    return orders.filter((order) => order.status === status)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
      return language === "uz" ? "Hozir" : "Now"
    } else if (diffInMinutes < 60) {
      return language === "uz" ? `${diffInMinutes} daqiqa oldin` : `${diffInMinutes}m ago`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      return language === "uz" ? `${hours} soat oldin` : `${hours}h ago`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary text-secondary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                <h1 className="text-xl font-bold">{language === "uz" ? "Ofitsiant paneli" : "Waiter Dashboard"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "uz" ? "en" : "uz")}>
                {language === "uz" ? "EN" : "UZ"}
              </Button>
              <Button variant="ghost" size="sm" onClick={loadOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === "uz" ? "Yangilash" : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{getOrdersByStatus("pending").length}</div>
              <div className="text-sm text-muted-foreground">
                {language === "uz" ? "Yangi buyurtmalar" : "New Orders"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getOrdersByStatus("preparing").length}</div>
              <div className="text-sm text-muted-foreground">{language === "uz" ? "Tayyorlanmoqda" : "Preparing"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getOrdersByStatus("ready").length}</div>
              <div className="text-sm text-muted-foreground">{language === "uz" ? "Tayyor" : "Ready"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{getOrdersByStatus("served").length}</div>
              <div className="text-sm text-muted-foreground">{language === "uz" ? "Berildi" : "Served"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders by Status */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="relative">
              {language === "uz" ? "Yangi" : "New"}
              {getOrdersByStatus("pending").length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-yellow-500">
                  {getOrdersByStatus("pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="relative">
              {language === "uz" ? "Tayyorlanmoqda" : "Preparing"}
              {getOrdersByStatus("preparing").length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
                  {getOrdersByStatus("preparing").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready" className="relative">
              {language === "uz" ? "Tayyor" : "Ready"}
              {getOrdersByStatus("ready").length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-green-500">
                  {getOrdersByStatus("ready").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="served">{language === "uz" ? "Berildi" : "Served"}</TabsTrigger>
          </TabsList>

          {(["pending", "preparing", "ready", "served"] as const).map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getOrdersByStatus(status).map((order) => (
                  <Card
                    key={order.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {language === "uz" ? "Stol" : "Table"} {order.tableNumber}
                        </CardTitle>
                        <Badge className={`${getStatusColor(status)} text-white`}>{getStatusText(status)}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.timestamp)}
                        </span>
                        <span className="text-xs">{getTimeAgo(order.timestamp)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.customerName && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3" />
                            {order.customerName}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} {language === "uz" ? "ta mahsulot" : "items"}
                        </div>
                        <div className="text-lg font-bold text-primary">{formatPrice(order.total)}</div>
                        <div className="flex gap-2 mt-3">
                          {status === "pending" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(order.id, "preparing")
                              }}
                              className="flex-1"
                            >
                              <ChefHat className="h-3 w-3 mr-1" />
                              {language === "uz" ? "Boshlash" : "Start"}
                            </Button>
                          )}
                          {status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(order.id, "ready")
                              }}
                              className="flex-1"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {language === "uz" ? "Tayyor" : "Ready"}
                            </Button>
                          )}
                          {status === "ready" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(order.id, "served")
                              }}
                              className="flex-1"
                            >
                              <Utensils className="h-3 w-3 mr-1" />
                              {language === "uz" ? "Berildi" : "Served"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {getOrdersByStatus(status).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    {language === "uz" ? "Bu holatda buyurtmalar yo'q" : "No orders in this status"}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {language === "uz" ? "Oxirgi yangilanish:" : "Last updated:"} {formatTime(lastRefresh)}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>
                    {language === "uz" ? "Buyurtma" : "Order"} #{selectedOrder.id}
                  </span>
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {language === "uz" ? "Stol" : "Table"} {selectedOrder.tableNumber} •{" "}
                  {formatTime(selectedOrder.timestamp)} • {getTimeAgo(selectedOrder.timestamp)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Customer Info */}
                {selectedOrder.customerName && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">
                      {language === "uz" ? "Mijoz ma'lumotlari" : "Customer Information"}
                    </h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedOrder.customerName}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">
                    {language === "uz" ? "Buyurtma tafsilotlari" : "Order Details"}
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={language === "uz" ? item.nameUz : item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{language === "uz" ? item.nameUz : item.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === "uz" ? "Izoh:" : "Notes:"} {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{language === "uz" ? "Jami:" : "Total:"}</span>
                    <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedOrder.status === "pending" && (
                    <Button onClick={() => handleStatusUpdate(selectedOrder.id, "preparing")} className="flex-1">
                      <ChefHat className="h-4 w-4 mr-2" />
                      {language === "uz" ? "Tayyorlashni boshlash" : "Start Preparing"}
                    </Button>
                  )}
                  {selectedOrder.status === "preparing" && (
                    <Button onClick={() => handleStatusUpdate(selectedOrder.id, "ready")} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {language === "uz" ? "Tayyor deb belgilash" : "Mark as Ready"}
                    </Button>
                  )}
                  {selectedOrder.status === "ready" && (
                    <Button onClick={() => handleStatusUpdate(selectedOrder.id, "served")} className="flex-1">
                      <Utensils className="h-4 w-4 mr-2" />
                      {language === "uz" ? "Berildi deb belgilash" : "Mark as Served"}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
