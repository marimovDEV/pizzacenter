"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UtensilsCrossed, Clock, MapPin, Phone, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface Review {
  id: string
  name: string
  surname: string
  comment: string
  rating: number
  date: string
  approved: boolean
}

export default function HomePage() {
  const [language, setLanguage] = useState<"uz" | "ru" | "en">("uz")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const savedReviews = localStorage.getItem("restaurant-reviews")
    if (savedReviews) {
      const allReviews: Review[] = JSON.parse(savedReviews)
      // Only show approved reviews
      setReviews(allReviews.filter((review) => review.approved))
    }
  }, [])

  const handleSubmitReview = () => {
    if (!name.trim() || !surname.trim() || !comment.trim() || rating === 0) {
      alert(
        language === "uz"
          ? "Iltimos, barcha maydonlarni to'ldiring va yulduz qo'ying!"
          : language === "ru"
            ? "Пожалуйста, заполните все поля и поставьте звезды!"
            : "Please fill all fields and add stars!",
      )
      return
    }

    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      surname: surname.trim(),
      comment: comment.trim(),
      rating,
      date: new Date().toLocaleDateString(),
      approved: false, // Needs admin approval
    }

    const savedReviews = localStorage.getItem("restaurant-reviews")
    const allReviews: Review[] = savedReviews ? JSON.parse(savedReviews) : []
    const updatedReviews = [newReview, ...allReviews]
    localStorage.setItem("restaurant-reviews", JSON.stringify(updatedReviews))

    // Reset form
    setName("")
    setSurname("")
    setComment("")
    setRating(0)

    alert(
      language === "uz"
        ? "Izohingiz uchun rahmat! Admin tasdiqlashdan keyin ko'rsatiladi."
        : language === "ru"
          ? "Спасибо за ваш отзыв! Он будет показан после одобрения администратором."
          : "Thank you for your review! It will be shown after admin approval.",
    )
  }

  const translations = {
    uz: {
      title: "Tokyo",
      subtitle: "O'zbek milliy oshxonasining eng mazali taomlarini tatib ko'ring",
      viewMenu: "Menyuni Ko'rish",
      workTime: "Ish Vaqti",
      workHours: "Har kuni: 09:00 - 23:00",
      address: "Manzil",
      addressText: "Toshkent sh., Amir Temur ko'chasi 15",
      phone: "Telefon",
      aboutTitle: "Restoran Haqida",
      aboutText1:
        "Bizning restoranimiz 2010-yildan beri O'zbekistonning eng mazali milliy taomlarini tayyorlash bilan shug'ullanadi. Har bir taom an'anaviy retseptlar asosida tayyorlanadi va eng sifatli mahsulotlardan foydalaniladi.",
      aboutText2:
        "Biz sizga qulay muhit, tez xizmat va unutilmas ta'mlarni taqdim etamiz. Oilaviy ziyofatlar, do'stlar bilan uchrashuvlar yoki ishbilarmonlik uchrashuvlari uchun ideal joy!",
      goToMenu: "Menyuga O'tish →",
      reviewsTitle: "Izohlar",
      leaveReview: "Izoh Qoldirish",
      firstName: "Ism",
      lastName: "Familiya",
      yourComment: "Sizning izohingiz",
      rateUs: "Bizni baholang",
      submit: "Yuborish",
      noReviews: "Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!",
    },
    ru: {
      title: "Tokyo",
      subtitle: "Попробуйте самые вкусные блюда узбекской национальной кухни",
      viewMenu: "Посмотреть Меню",
      workTime: "Время Работы",
      workHours: "Ежедневно: 09:00 - 23:00",
      address: "Адрес",
      addressText: "г. Ташкент, ул. Амира Темура 15",
      phone: "Телефон",
      aboutTitle: "О Ресторане",
      aboutText1:
        "Наш ресторан с 2010 года занимается приготовлением самых вкусных национальных блюд Узбекистана. Каждое блюдо готовится по традиционным рецептам с использованием самых качественных продуктов.",
      aboutText2:
        "Мы предлагаем вам комфортную атмосферу, быстрое обслуживание и незабываемые вкусы. Идеальное место для семейных торжеств, встреч с друзьями или деловых встреч!",
      goToMenu: "Перейти в Меню →",
      reviewsTitle: "Отзывы",
      leaveReview: "Оставить Отзыв",
      firstName: "Имя",
      lastName: "Фамилия",
      yourComment: "Ваш отзыв",
      rateUs: "Оцените нас",
      submit: "Отправить",
      noReviews: "Пока нет отзывов. Будьте первым!",
    },
    en: {
      title: "Tokyo",
      subtitle: "Taste the most delicious dishes of Uzbek national cuisine",
      viewMenu: "View Menu",
      workTime: "Working Hours",
      workHours: "Daily: 09:00 - 23:00",
      address: "Address",
      addressText: "Tashkent, Amir Temur Street 15",
      phone: "Phone",
      aboutTitle: "About Restaurant",
      aboutText1:
        "Our restaurant has been preparing the most delicious national dishes of Uzbekistan since 2010. Each dish is prepared according to traditional recipes using the highest quality products.",
      aboutText2:
        "We offer you a comfortable atmosphere, fast service and unforgettable tastes. The perfect place for family celebrations, meetings with friends or business meetings!",
      goToMenu: "Go to Menu →",
      reviewsTitle: "Reviews",
      leaveReview: "Leave a Review",
      firstName: "First Name",
      lastName: "Last Name",
      yourComment: "Your comment",
      rateUs: "Rate us",
      submit: "Submit",
      noReviews: "No reviews yet. Be the first!",
    },
  }

  const t = translations[language]

  const goToMenu = () => {
    localStorage.setItem("restaurant-language", language)
    window.location.href = "/menu"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Language Toggle */}
      <div className="container mx-auto px-4 pt-4">
        <div className="grid grid-cols-3 gap-2 md:flex md:justify-end md:gap-2">
          <Button
            variant={language === "uz" ? "default" : "outline"}
            onClick={() => setLanguage("uz")}
            className={`w-full md:w-auto ${language === "uz" ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            O'zbekcha
          </Button>
          <Button
            variant={language === "ru" ? "default" : "outline"}
            onClick={() => setLanguage("ru")}
            className={`w-full md:w-auto ${language === "ru" ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            Русский
          </Button>
          <Button
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
            className={`w-full md:w-auto ${language === "en" ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            English
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl">
            <img
              src="/logo.jpg"
              alt="Tokyo Restaurant Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                // Fallback to icon if logo image fails to load
                e.currentTarget.style.display = "none"
                e.currentTarget.nextElementSibling?.classList.remove("hidden")
              }}
            />
            <UtensilsCrossed className="w-16 h-16 text-white hidden" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-green-800 mb-8 font-medium">{t.subtitle}</p>
          <Button
            size="lg"
            onClick={goToMenu}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
          >
            {t.viewMenu}
          </Button>
        </div>

        {/* Restaurant Info Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm p-3 md:p-8 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-200">
            <div className="flex items-center justify-center w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-2 md:mb-4 mx-auto">
              <Clock className="w-4 h-4 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-xs md:text-xl font-bold text-green-800 mb-1 md:mb-2 text-center">{t.workTime}</h3>
            <p className="text-[10px] md:text-base text-green-700 text-center font-medium">{t.workHours}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 md:p-8 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-200">
            <div className="flex items-center justify-center w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-2 md:mb-4 mx-auto">
              <MapPin className="w-4 h-4 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-xs md:text-xl font-bold text-green-800 mb-1 md:mb-2 text-center">{t.address}</h3>
            <p className="text-[10px] md:text-base text-green-700 text-center font-medium">{t.addressText}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 md:p-8 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-200">
            <div className="flex items-center justify-center w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-2 md:mb-4 mx-auto">
              <Phone className="w-4 h-4 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-xs md:text-xl font-bold text-green-800 mb-1 md:mb-2 text-center">{t.phone}</h3>
            <p className="text-[10px] md:text-base text-green-700 text-center font-medium">+998 90 123 45 67</p>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-green-200 mb-16">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t.aboutTitle}
          </h2>
          <div className="space-y-6 text-green-800 text-lg leading-relaxed">
            <p className="text-center font-medium">{t.aboutText1}</p>
            <p className="text-center font-medium">{t.aboutText2}</p>
          </div>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              onClick={goToMenu}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 text-lg font-bold rounded-full shadow-xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
            >
              {t.goToMenu}
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t.reviewsTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Leave Review Form */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6">{t.leaveReview}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-green-800 font-medium mb-2">{t.firstName}</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.firstName}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-green-800 font-medium mb-2">{t.lastName}</label>
                  <Input
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder={t.lastName}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-green-800 font-medium mb-2">{t.yourComment}</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.yourComment}
                    rows={4}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-green-800 font-medium mb-2">{t.rateUs}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-green-500/50 transition-all duration-300"
                >
                  {t.submit}
                </Button>
              </div>
            </div>

            {/* Display Reviews */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-green-200 max-h-[600px] overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-center text-green-700 text-lg py-12">{t.noReviews}</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-green-50 p-6 rounded-2xl border border-green-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-green-900 text-lg">
                            {review.name} {review.surname}
                          </h4>
                          <p className="text-sm text-green-600">{review.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-green-800 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
