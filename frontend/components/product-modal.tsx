"use client"

import { useState, useEffect } from "react"
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

    // Scroll Lock Logic
    useEffect(() => {
        if (isOpen && item) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, item])

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-lg animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-slate-950/10"
                onClick={onClose}
            />
            <div className="relative bg-slate-900 md:bg-gradient-to-b md:from-slate-900 md:via-slate-800 md:to-slate-900 rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-w-lg w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 ease-out">
                {/* Close Button - More accessible on mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center transition-all text-white border border-white/20 active:scale-95 shadow-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Image Section */}
                    <div className="relative h-64 md:h-80 w-full">
                        <Image
                            src={getImageUrl(item.image)}
                            alt={getName()}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover"
                            priority={true}
                            unoptimized={true}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                            <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                            <span className="text-white font-bold text-sm">{item.rating}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 md:p-6 -mt-8 relative">
                        {/* Header Info */}
                        <div className="mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{getName()}</h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {item.weight && item.weight > 0 && (
                                    <div className="flex items-center gap-1.5 text-white/50 text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                        <Weight className="w-3.5 h-3.5" />
                                        <span>{formatWeight(item.weight)}</span>
                                    </div>
                                )}
                                {item.prep_time && (
                                    <div className="flex items-center gap-1.5 text-white/50 text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{item.prep_time} min</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-white/70 text-sm md:text-base leading-relaxed">
                                {getDescription()}
                            </p>
                        </div>

                        {/* Ingredients */}
                        {getIngredients().length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                    {language === "uz" ? "Tarkibi" : language === "ru" ? "Состав" : "Ingredients"}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {getIngredients().map((ingredient, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-white/5 text-white/60 px-3 py-1.5 rounded-xl border border-white/5"
                                        >
                                            {ingredient}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="p-4 md:p-6 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-white/40 text-xs uppercase tracking-wider font-bold">
                            {language === "uz" ? "Narxi" : language === "ru" ? "Цена" : "Price"}
                        </span>
                        <div className="text-2xl font-black text-emerald-400">
                            {formatPrice(item.price)}
                        </div>
                    </div>

                    {cartQuantity === 0 ? (
                        <Button
                            onClick={handleAddToCart}
                            disabled={!item.available}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-14 text-base font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {language === "uz" ? "Savatga qo'shish" : language === "ru" ? "Добавить в корзину" : "Add to Cart"}
                        </Button>
                    ) : (
                        <div className="flex items-center justify-between bg-white/5 rounded-2xl p-1.5 border border-white/10">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleDecrement}
                                className="h-11 w-11 rounded-xl hover:bg-white/10 text-white transition-all active:scale-90"
                            >
                                <Minus className="w-5 h-5" />
                            </Button>
                            <div className="flex flex-col items-center">
                                <span className="text-white font-black text-xl">{cartQuantity}</span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">
                                    {formatPrice(item.price * cartQuantity)}
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleIncrement}
                                className="h-11 w-11 rounded-xl hover:bg-white/10 text-white transition-all active:scale-90"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div >
        </div >
    )
}
