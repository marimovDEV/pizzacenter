"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Minus, ShoppingCart, Star, Clock, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { MenuItem } from "@/lib/types"
import { formatPrice, formatWeight } from "@/lib/api"

interface ProductModalProps {
    item: MenuItem | null
    isOpen: boolean
    onClose: () => void
    language: "uz" | "ru" | "en"
}

export function ProductModal({ item, isOpen, onClose, language }: ProductModalProps) {
    const { cart, addToCart, updateQuantity } = useCart()

    if (!isOpen || !item) return null

    const cartItem = cart.find((ci) => ci.menuItem.id === item.id)
    const cartQuantity = cartItem?.quantity || 0

    const getName = () => {
        if (language === "uz") return item.name_uz
        if (language === "ru") return item.name_ru
        return item.name
    }

    const getDescription = () => {
        if (language === "uz") return item.description_uz
        if (language === "ru") return item.description_ru
        return item.description
    }

    const getIngredients = () => {
        if (language === "uz") return item.ingredients_uz || []
        if (language === "ru") return item.ingredients_ru || []
        return item.ingredients || []
    }

    const handleAddToCart = () => {
        addToCart(item)
    }

    const handleIncrement = () => {
        addToCart(item)
    }

    const handleDecrement = () => {
        if (cartQuantity > 0) {
            updateQuantity(item.id, cartQuantity - 1)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all text-white border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="relative h-64 md:h-96 w-full">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={getName()}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                        className="object-cover"
                        priority={true}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                        <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                        <span className="text-white font-bold">{item.rating}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 -mt-10 relative">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{getName()}</h2>
                            <div className="flex flex-wrap gap-3">
                                {item.weight && item.weight > 0 && (
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full">
                                        <Weight className="w-4 h-4" />
                                        <span>{formatWeight(item.weight)}</span>
                                    </div>
                                )}
                                {item.prep_time && (
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4" />
                                        <span>{item.prep_time} min</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                            {formatPrice(item.price)}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                        {getDescription()}
                    </p>

                    {/* Ingredients */}
                    {getIngredients().length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {language === "uz" ? "Tarkibi" : language === "ru" ? "Состав" : "Ingredients"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {getIngredients().map((ingredient, index) => (
                                    <span
                                        key={index}
                                        className="text-sm bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/5"
                                    >
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-white/10">
                        {cartQuantity === 0 ? (
                            <Button
                                onClick={handleAddToCart}
                                disabled={!item.available}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl h-14 text-lg font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {language === "uz" ? "Savatga qo'shish" : language === "ru" ? "Добавить в корзину" : "Add to Cart"}
                                <span className="ml-2 opacity-80 font-normal">| {formatPrice(item.price)}</span>
                            </Button>
                        ) : (
                            <div className="flex items-center justify-between bg-white/5 rounded-xl p-2 border border-white/10">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleDecrement}
                                    className="h-12 w-12 rounded-lg hover:bg-white/10 text-white transition-all"
                                >
                                    <Minus className="w-6 h-6" />
                                </Button>
                                <div className="flex flex-col items-center">
                                    <span className="text-white font-bold text-xl">{cartQuantity}</span>
                                    <span className="text-xs text-gray-400">
                                        {formatPrice(item.price * cartQuantity)}
                                    </span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleIncrement}
                                    className="h-12 w-12 rounded-lg hover:bg-white/10 text-white transition-all"
                                >
                                    <Plus className="w-6 h-6" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
