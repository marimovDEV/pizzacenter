"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/types"

interface IngredientsDisplayProps {
  ingredients: string[]
  maxVisible?: number
  className?: string
}

export function IngredientsDisplay({
  ingredients,
  maxVisible = 3,
  className = ""
}: IngredientsDisplayProps) {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (!ingredients || ingredients.length === 0) return null

  const visibleIngredients = ingredients.slice(0, maxVisible)
  const remainingCount = ingredients.length - maxVisible
  const hasMore = remainingCount > 0

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Ko'rsatiladigan ingredientlar */}
        {visibleIngredients.map((ingredient, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
          >
            {ingredient}
          </span>
        ))}

        {/* +N tugmasi */}
        {hasMore && (
          <div className="relative">
            <button
              onClick={openModal}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              +{remainingCount}
            </button>

            {/* Desktop tooltip */}
            <div
              className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 z-50 transition-all duration-200 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="flex flex-col gap-1">
                {ingredients.slice(maxVisible).map((ingredient, index) => (
                  <span key={index} className="whitespace-nowrap">
                    {ingredient}
                  </span>
                ))}
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-sm mx-auto border border-gray-700 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {language === "uz" ? "Ovqat Tarkibi" : language === "ru" ? "Состав Блюда" : "Dish Ingredients"}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === "uz" ? "Barcha ingredientlar ro'yxati" : language === "ru" ? "Список всех ингредиентов" : "List of all ingredients"}
              </p>
            </div>

            {/* Ingredients List */}
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <span className="text-white font-medium">{ingredient}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {language === "uz" ? "Yopish" : language === "ru" ? "Закрыть" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Modal (for larger screens if needed) */}
      {isModalOpen && (
        <div className="hidden md:block fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 w-full max-w-md mx-auto border border-gray-700 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === "uz" ? "Ovqat Tarkibi" : language === "ru" ? "Состав Блюда" : "Dish Ingredients"}
              </h3>
              <p className="text-gray-400">
                {language === "uz" ? "Barcha ingredientlar ro'yxati" : language === "ru" ? "Список всех ингредиентов" : "List of all ingredients"}
              </p>
            </div>

            {/* Ingredients Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <span className="text-white font-medium text-sm">{ingredient}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {language === "uz" ? "Yopish" : language === "ru" ? "Закрыть" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
