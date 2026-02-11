"use client"

import { IngredientsDisplay } from "@/components/ingredients-display"
import { useLanguage } from "@/lib/language-context"

export default function IngredientsDemo() {
  const { language } = useLanguage()
  
  const sampleDishes = [
    {
      name: "California Roll",
      ingredients: ["Krab", "Avokado", "Bodring", "Nori", "Guruch"]
    },
    {
      name: "Spicy Tuna Roll", 
      ingredients: ["Tuna", "Achchiq Mayo", "Bodring", "Yashil Piyoz", "Nori", "Guruch", "Sesame"]
    },
    {
      name: "Tonkotsu Ramen",
      ingredients: ["Cho'chqa Suyagi Sho'rvasi", "Chashu Cho'chqa", "Yumshoq Tuxum", "Lagmon", "Yashil Piyoz", "Nori"]
    },
    {
      name: "Gyoza",
      ingredients: ["Cho'chqa", "Sabzavotlar", "Dumpling Qopqog'i", "Soya Sous"]
    },
    {
      name: "Tempura",
      ingredients: ["Sabzavotlar", "Qisqichbaqa", "Tempura Xamiri", "Tempura Sous", "Wasabi", "Gari"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === "uz" ? "Ovqat Tarkibi Komponenti" : language === "ru" ? "Компонент Состава Блюда" : "Dish Ingredients Component"}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === "uz" 
              ? "Zamonaviy restoran menyusi uchun ingredientlar ko'rsatish komponenti. Mobil qurilmalarda modal, desktop'da tooltip bilan ishlaydi."
              : language === "ru" 
              ? "Компонент для отображения ингредиентов современного ресторанного меню. Работает с модальными окнами на мобильных устройствах и подсказками на десктопе."
              : "Modern restaurant menu ingredient display component. Works with modals on mobile devices and tooltips on desktop."
            }
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleDishes.map((dish, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              {/* Dish Name */}
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                {dish.name}
              </h3>
              
              {/* Ingredients */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-3">
                  {language === "uz" ? "Ingredientlar:" : language === "ru" ? "Ингредиенты:" : "Ingredients:"}
                </p>
                <IngredientsDisplay 
                  ingredients={dish.ingredients}
                  maxVisible={3}
                />
              </div>
              
              {/* Info */}
              <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-700">
                {dish.ingredients.length} {language === "uz" ? "ta ingredient" : language === "ru" ? "ингредиентов" : "ingredients"} • 
                {dish.ingredients.length > 3 
                  ? ` +${dish.ingredients.length - 3} ${language === "uz" ? "ta yana" : language === "ru" ? "еще" : "more"}`
                  : ` ${language === "uz" ? "Barchasi ko'rinadi" : language === "ru" ? "Все показаны" : "All visible"}`
                }
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl p-8 border border-orange-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {language === "uz" ? "Qanday Ishlaydi?" : language === "ru" ? "Как Это Работает?" : "How Does It Work?"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === "uz" ? "Ingredientlar" : language === "ru" ? "Ингредиенты" : "Ingredients"}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === "uz" 
                  ? "Faqat 3 ta ingredient ko'rsatiladi, qolganlari +N belgisi bilan yashirinadi"
                  : language === "ru" 
                  ? "Показывается только 3 ингредиента, остальные скрыты с меткой +N"
                  : "Only 3 ingredients are shown, the rest are hidden with +N label"
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === "uz" ? "Mobil" : language === "ru" ? "Мобильный" : "Mobile"}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === "uz" 
                  ? "+N ustiga bosganda modal oynada barcha ingredientlar ko'rinadi"
                  : language === "ru" 
                  ? "При нажатии на +N в модальном окне отображаются все ингредиенты"
                  : "Clicking +N shows all ingredients in a modal window"
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === "uz" ? "Desktop" : language === "ru" ? "Десктоп" : "Desktop"}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === "uz" 
                  ? "+N ustiga olib borganda tooltip'da qolgan ingredientlar ko'rinadi"
                  : language === "ru" 
                  ? "При наведении на +N в подсказке отображаются остальные ингредиенты"
                  : "Hovering over +N shows remaining ingredients in a tooltip"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
