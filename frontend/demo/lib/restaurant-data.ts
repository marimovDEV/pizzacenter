export interface MenuItem {
  id: string
  name: string
  nameUz: string
  nameRu: string
  description: string
  descriptionUz: string
  descriptionRu: string
  price: number
  image: string
  category: string
  available: boolean
  prepTime?: string // e.g., "15-20"
  rating?: number // e.g., 4.8
  ingredients: string[]
  ingredientsUz: string[]
  ingredientsRu: string[]
}

export interface Category {
  id: string
  name: string
  nameUz: string
  nameRu: string
  icon: string
  image: string
}

export interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  tableNumber: number
  items: CartItem[]
  total: number
  status: "pending" | "preparing" | "ready" | "served"
  timestamp: Date
  customerName?: string
}

export interface Promotion {
  id: string
  title: string
  titleUz: string
  titleRu: string
  description: string
  descriptionUz: string
  descriptionRu: string
  image: string
  active: boolean
  link?: string
  category?: string
}

export interface Review {
  id: string
  name: string
  surname: string
  comment: string
  rating: number
  date: string
  approved: boolean
}

// Mock categories
export const categories: Category[] = [
  {
    id: "1",
    name: "Appetizers",
    nameUz: "Ishtaha ochuvchilar",
    nameRu: "Закуски",
    icon: "🥗",
    image: "/category-appetizers.jpg",
  },
  {
    id: "2",
    name: "Main Dishes",
    nameUz: "Asosiy taomlar",
    nameRu: "Основные блюда",
    icon: "🍽️",
    image: "/category-main.jpg",
  },
  {
    id: "3",
    name: "Soups",
    nameUz: "Sho'rvalar",
    nameRu: "Супы",
    icon: "🍲",
    image: "/category-soups.jpg",
  },
  {
    id: "4",
    name: "Desserts",
    nameUz: "Shirinliklar",
    nameRu: "Десерты",
    icon: "🍰",
    image: "/category-desserts.jpg",
  },
  {
    id: "5",
    name: "Beverages",
    nameUz: "Ichimliklar",
    nameRu: "Напитки",
    icon: "🥤",
    image: "/category-beverages.jpg",
  },
  {
    id: "6",
    name: "Pizza",
    nameUz: "Pizza",
    nameRu: "Пицца",
    icon: "🍕",
    image: "/category-pizza.jpg",
  },
  {
    id: "7",
    name: "Special Offers",
    nameUz: "Aksiya",
    nameRu: "Акции",
    icon: "🎉",
    image: "/category-promotions.jpg",
  },
]

// Mock menu items
export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: "1",
    name: "Bruschetta",
    nameUz: "Brusketta",
    nameRu: "Брускетта",
    description: "Toasted bread with fresh tomatoes, garlic, and basil",
    descriptionUz: "Qovurilgan non yangi pomidor, sarimsoq va rayhon bilan",
    descriptionRu: "Поджаренный хлеб со свежими помидорами, чесноком и базиликом",
    price: 28000,
    image: "/bruschetta.jpg",
    category: "1",
    available: true,
    prepTime: "10-15",
    rating: 4.7,
    ingredients: [
      "Baguette bread - 4 slices",
      "Fresh tomatoes - 200g",
      "Garlic - 2 cloves",
      "Fresh basil - 10g",
      "Olive oil - 30ml",
    ],
    ingredientsUz: [
      "Baget non - 4 bo'lak",
      "Yangi pomidor - 200g",
      "Sarimsoq - 2 dona",
      "Yangi rayhon - 10g",
      "Zaytun moyi - 30ml",
    ],
    ingredientsRu: [
      "Багет - 4 ломтика",
      "Свежие помидоры - 200г",
      "Чеснок - 2 зубчика",
      "Свежий базилик - 10г",
      "Оливковое масло - 30мл",
    ],
  },
  {
    id: "2",
    name: "Spring Rolls",
    nameUz: "Bahor ruletlari",
    nameRu: "Весенние роллы",
    description: "Crispy vegetable rolls with sweet chili sauce",
    descriptionUz: "Xırtıldoq sabzavot ruletlari shirin chili sousi bilan",
    descriptionRu: "Хрустящие овощные роллы со сладким соусом чили",
    price: 32000,
    image: "/spring-rolls.jpg",
    category: "1",
    available: true,
    prepTime: "12-18",
    rating: 4.6,
    ingredients: [
      "Rice paper - 6 sheets",
      "Cabbage - 100g",
      "Carrots - 100g",
      "Bean sprouts - 50g",
      "Sweet chili sauce - 100ml",
    ],
    ingredientsUz: [
      "Guruch qog'ozi - 6 dona",
      "Karam - 100g",
      "Sabzi - 100g",
      "Loviya nihollar - 50g",
      "Shirin chili sousi - 100ml",
    ],
    ingredientsRu: [
      "Рисовая бумага - 6 листов",
      "Капуста - 100г",
      "Морковь - 100г",
      "Ростки фасоли - 50г",
      "Сладкий соус чили - 100мл",
    ],
  },
  {
    id: "3",
    name: "Greek Salad",
    nameUz: "Yunon salati",
    nameRu: "Греческий салат",
    description: "Fresh salad with feta cheese, olives, and vegetables",
    descriptionUz: "Yangi salat feta pishloqi, zaytun va sabzavotlar bilan",
    descriptionRu: "Свежий салат с сыром фета, оливками и овощами",
    price: 38000,
    image: "/greek-salad.jpg",
    category: "1",
    available: true,
    prepTime: "8-12",
    rating: 4.8,
    ingredients: ["Tomatoes - 200g", "Cucumbers - 150g", "Feta cheese - 100g", "Black olives - 50g", "Red onion - 50g"],
    ingredientsUz: [
      "Pomidor - 200g",
      "Bodring - 150g",
      "Feta pishloqi - 100g",
      "Qora zaytun - 50g",
      "Qizil piyoz - 50g",
    ],
    ingredientsRu: ["Помидоры - 200г", "Огурцы - 150г", "Сыр фета - 100г", "Черные оливки - 50г", "Красный лук - 50г"],
  },

  // Main Dishes
  {
    id: "4",
    name: "Beef Steak",
    nameUz: "Mol go'shti bifshteks",
    nameRu: "Говяжий стейк",
    description: "Premium beef steak with roasted vegetables",
    descriptionUz: "Premium mol go'shti bifshteks qovurilgan sabzavotlar bilan",
    descriptionRu: "Премиум говяжий стейк с жареными овощами",
    price: 125000,
    image: "/beef-steak.jpg",
    category: "2",
    available: true,
    prepTime: "20-25",
    rating: 4.9,
    ingredients: [
      "Beef tenderloin - 350g",
      "Butter - 50g",
      "Garlic - 4 cloves",
      "Fresh rosemary - 5g",
      "Mixed vegetables - 200g",
    ],
    ingredientsUz: [
      "Mol go'shti tenderloin - 350g",
      "Sariyog' - 50g",
      "Sarimsoq - 4 dona",
      "Yangi rozmarin - 5g",
      "Aralash sabzavotlar - 200g",
    ],
    ingredientsRu: [
      "Говяжья вырезка - 350г",
      "Сливочное масло - 50г",
      "Чеснок - 4 зубчика",
      "Свежий розмарин - 5г",
      "Смешанные овощи - 200г",
    ],
  },
  {
    id: "5",
    name: "Salmon Fillet",
    nameUz: "Losos filesi",
    nameRu: "Филе лосося",
    description: "Grilled salmon with lemon butter sauce",
    descriptionUz: "Panjara losos limon sariyog' sousi bilan",
    descriptionRu: "Лосось на гриле с лимонно-масляным соусом",
    price: 98000,
    image: "/salmon-fillet.jpg",
    category: "2",
    available: true,
    prepTime: "15-20",
    rating: 4.8,
    ingredients: ["Salmon fillet - 300g", "Lemon - 1 piece", "Butter - 40g", "Dill - 10g", "White wine - 50ml"],
    ingredientsUz: ["Losos filesi - 300g", "Limon - 1 dona", "Sariyog' - 40g", "Ukrop - 10g", "Oq sharob - 50ml"],
    ingredientsRu: [
      "Филе лосося - 300г",
      "Лимон - 1 штука",
      "Сливочное масло - 40г",
      "Укроп - 10г",
      "Белое вино - 50мл",
    ],
  },
  {
    id: "6",
    name: "Chicken Alfredo",
    nameUz: "Tovuq Alfredo",
    nameRu: "Курица Альфредо",
    description: "Creamy pasta with grilled chicken and parmesan",
    descriptionUz: "Qaymoqli pasta panjara tovuq va parmesan bilan",
    descriptionRu: "Кремовая паста с курицей гриль и пармезаном",
    price: 72000,
    image: "/chicken-alfredo.jpg",
    category: "2",
    available: true,
    prepTime: "18-22",
    rating: 4.7,
    ingredients: [
      "Fettuccine pasta - 200g",
      "Chicken breast - 200g",
      "Heavy cream - 200ml",
      "Parmesan cheese - 80g",
      "Garlic - 3 cloves",
    ],
    ingredientsUz: [
      "Fettuccine pasta - 200g",
      "Tovuq ko'kragi - 200g",
      "Og'ir qaymoq - 200ml",
      "Parmesan pishloqi - 80g",
      "Sarimsoq - 3 dona",
    ],
    ingredientsRu: [
      "Паста феттучини - 200г",
      "Куриная грудка - 200г",
      "Жирные сливки - 200мл",
      "Сыр пармезан - 80г",
      "Чеснок - 3 зубчика",
    ],
  },

  // Soups
  {
    id: "7",
    name: "Tom Yum Soup",
    nameUz: "Tom Yum sho'rva",
    nameRu: "Суп Том Ям",
    description: "Spicy Thai soup with shrimp and lemongrass",
    descriptionUz: "Achchiq Tailand sho'rva qisqichbaqa va limon o'ti bilan",
    descriptionRu: "Острый тайский суп с креветками и лимонграссом",
    price: 48000,
    image: "/tom-yum-soup.jpg",
    category: "3",
    available: true,
    prepTime: "15-20",
    rating: 4.6,
    ingredients: [
      "Shrimp - 200g",
      "Lemongrass - 2 stalks",
      "Galangal - 30g",
      "Lime leaves - 5 pieces",
      "Chili peppers - 3 pieces",
    ],
    ingredientsUz: [
      "Qisqichbaqa - 200g",
      "Limon o'ti - 2 poya",
      "Galangal - 30g",
      "Ohak barglari - 5 dona",
      "Chili qalampir - 3 dona",
    ],
    ingredientsRu: [
      "Креветки - 200г",
      "Лимонграсс - 2 стебля",
      "Галангал - 30г",
      "Листья лайма - 5 штук",
      "Перец чили - 3 штуки",
    ],
  },
  {
    id: "8",
    name: "French Onion Soup",
    nameUz: "Frantsuz piyoz sho'rva",
    nameRu: "Французский луковый суп",
    description: "Classic soup with caramelized onions and cheese",
    descriptionUz: "Klassik sho'rva karamellashgan piyoz va pishloq bilan",
    descriptionRu: "Классический суп с карамелизированным луком и сыром",
    price: 42000,
    image: "/french-onion-soup.jpg",
    category: "3",
    available: true,
    prepTime: "35-40",
    rating: 4.5,
    ingredients: [
      "Yellow onions - 500g",
      "Beef broth - 800ml",
      "Gruyere cheese - 100g",
      "Baguette - 4 slices",
      "White wine - 100ml",
    ],
    ingredientsUz: [
      "Sariq piyoz - 500g",
      "Mol go'shti buloni - 800ml",
      "Gruyere pishloqi - 100g",
      "Baget - 4 bo'lak",
      "Oq sharob - 100ml",
    ],
    ingredientsRu: [
      "Желтый лук - 500г",
      "Говяжий бульон - 800мл",
      "Сыр грюйер - 100г",
      "Багет - 4 ломтика",
      "Белое вино - 100мл",
    ],
  },
  {
    id: "9",
    name: "Minestrone",
    nameUz: "Minestrone",
    nameRu: "Минестроне",
    description: "Italian vegetable soup with pasta and beans",
    descriptionUz: "Italyan sabzavot sho'rva pasta va loviya bilan",
    descriptionRu: "Итальянский овощной суп с пастой и фасолью",
    price: 38000,
    image: "/minestrone-soup.jpg",
    category: "3",
    available: true,
    prepTime: "25-30",
    rating: 4.4,
    ingredients: [
      "Mixed vegetables - 400g",
      "White beans - 150g",
      "Small pasta - 100g",
      "Tomato paste - 50g",
      "Vegetable broth - 1L",
    ],
    ingredientsUz: [
      "Aralash sabzavotlar - 400g",
      "Oq loviya - 150g",
      "Kichik pasta - 100g",
      "Pomidor pastasi - 50g",
      "Sabzavot buloni - 1L",
    ],
    ingredientsRu: [
      "Смешанные овощи - 400г",
      "Белая фасоль - 150г",
      "Мелкая паста - 100г",
      "Томатная паста - 50г",
      "Овощной бульон - 1л",
    ],
  },

  // Desserts
  {
    id: "10",
    name: "Tiramisu",
    nameUz: "Tiramisu",
    nameRu: "Тирамису",
    description: "Classic Italian dessert with coffee and mascarpone",
    descriptionUz: "Klassik Italyan deserti qahva va maskarpone bilan",
    descriptionRu: "Классический итальянский десерт с кофе и маскарпоне",
    price: 35000,
    image: "/tiramisu.jpg",
    category: "4",
    available: true,
    prepTime: "20-25",
    rating: 4.9,
    ingredients: [
      "Mascarpone cheese - 250g",
      "Ladyfinger cookies - 200g",
      "Espresso coffee - 200ml",
      "Eggs - 3 pieces",
      "Cocoa powder - 20g",
    ],
    ingredientsUz: [
      "Maskarpone pishloqi - 250g",
      "Ladyfinger pechene - 200g",
      "Espresso qahva - 200ml",
      "Tuxum - 3 dona",
      "Kakao kukuni - 20g",
    ],
    ingredientsRu: [
      "Сыр маскарпоне - 250г",
      "Печенье савоярди - 200г",
      "Кофе эспрессо - 200мл",
      "Яйца - 3 штуки",
      "Какао-порошок - 20г",
    ],
  },
  {
    id: "11",
    name: "Cheesecake",
    nameUz: "Chizkeyk",
    nameRu: "Чизкейк",
    description: "New York style cheesecake with berry sauce",
    descriptionUz: "Nyu-York uslubidagi chizkeyk rezavorlar sousi bilan",
    descriptionRu: "Чизкейк в нью-йоркском стиле с ягодным соусом",
    price: 38000,
    image: "/cheesecake.jpg",
    category: "4",
    available: true,
    prepTime: "60-70",
    rating: 4.8,
    ingredients: [
      "Cream cheese - 500g",
      "Graham crackers - 200g",
      "Sugar - 150g",
      "Eggs - 3 pieces",
      "Mixed berries - 150g",
    ],
    ingredientsUz: [
      "Krem pishloq - 500g",
      "Graham pechene - 200g",
      "Shakar - 150g",
      "Tuxum - 3 dona",
      "Aralash rezavorlar - 150g",
    ],
    ingredientsRu: [
      "Сливочный сыр - 500г",
      "Печенье грэм - 200г",
      "Сахар - 150г",
      "Яйца - 3 штуки",
      "Смешанные ягоды - 150г",
    ],
  },
  {
    id: "12",
    name: "Panna Cotta",
    nameUz: "Panna Kotta",
    nameRu: "Панна Котта",
    description: "Silky Italian cream dessert with vanilla",
    descriptionUz: "Ipakdek Italyan qaymoq deserti vanil bilan",
    descriptionRu: "Шелковистый итальянский кремовый десерт с ванилью",
    price: 32000,
    image: "/panna-cotta.jpg",
    category: "4",
    available: true,
    prepTime: "15-20",
    rating: 4.7,
    ingredients: [
      "Heavy cream - 500ml",
      "Sugar - 80g",
      "Vanilla bean - 1 piece",
      "Gelatin - 10g",
      "Fresh berries - 100g",
    ],
    ingredientsUz: [
      "Og'ir qaymoq - 500ml",
      "Shakar - 80g",
      "Vanil loviya - 1 dona",
      "Jelatin - 10g",
      "Yangi rezavorlar - 100g",
    ],
    ingredientsRu: [
      "Жирные сливки - 500мл",
      "Сахар - 80г",
      "Ванильный стручок - 1 штука",
      "Желатин - 10г",
      "Свежие ягоды - 100г",
    ],
  },

  // Beverages
  {
    id: "13",
    name: "Fresh Lemonade",
    nameUz: "Yangi limonad",
    nameRu: "Свежий лимонад",
    description: "Homemade lemonade with fresh mint",
    descriptionUz: "Uy tayyorlangan limonad yangi yalpiz bilan",
    descriptionRu: "Домашний лимонад со свежей мятой",
    price: 18000,
    image: "/fresh-lemonade.jpg",
    category: "5",
    available: true,
    prepTime: "5-8",
    rating: 4.6,
    ingredients: ["Fresh lemons - 4 pieces", "Sugar - 100g", "Water - 1L", "Fresh mint - 20g", "Ice cubes - as needed"],
    ingredientsUz: [
      "Yangi limonlar - 4 dona",
      "Shakar - 100g",
      "Suv - 1L",
      "Yangi yalpiz - 20g",
      "Muz kublari - kerak bo'lganda",
    ],
    ingredientsRu: [
      "Свежие лимоны - 4 штуки",
      "Сахар - 100г",
      "Вода - 1л",
      "Свежая мята - 20г",
      "Кубики льда - по необходимости",
    ],
  },
  {
    id: "14",
    name: "Mango Smoothie",
    nameUz: "Mango smuti",
    nameRu: "Манго смузи",
    description: "Tropical mango smoothie with yogurt",
    descriptionUz: "Tropik mango smuti yogurt bilan",
    descriptionRu: "Тропический смузи из манго с йогуртом",
    price: 22000,
    image: "/mango-smoothie.jpg",
    category: "5",
    available: true,
    prepTime: "5-7",
    rating: 4.7,
    ingredients: ["Fresh mango - 2 pieces", "Greek yogurt - 200ml", "Honey - 30ml", "Ice cubes - 100g", "Milk - 100ml"],
    ingredientsUz: [
      "Yangi mango - 2 dona",
      "Yunon yogurti - 200ml",
      "Asal - 30ml",
      "Muz kublari - 100g",
      "Sut - 100ml",
    ],
    ingredientsRu: [
      "Свежее манго - 2 штуки",
      "Греческий йогурт - 200мл",
      "Мед - 30мл",
      "Кубики льда - 100г",
      "Молоко - 100мл",
    ],
  },
  {
    id: "15",
    name: "Iced Coffee",
    nameUz: "Muzli qahva",
    nameRu: "Холодный кофе",
    description: "Cold brew coffee with milk and ice",
    descriptionUz: "Sovuq qahva sut va muz bilan",
    descriptionRu: "Холодный кофе с молоком и льдом",
    price: 20000,
    image: "/iced-coffee.jpg",
    category: "5",
    available: true,
    prepTime: "3-5",
    rating: 4.5,
    ingredients: [
      "Cold brew coffee - 200ml",
      "Milk - 100ml",
      "Simple syrup - 30ml",
      "Ice cubes - 150g",
      "Whipped cream - optional",
    ],
    ingredientsUz: [
      "Sovuq qahva - 200ml",
      "Sut - 100ml",
      "Oddiy sirop - 30ml",
      "Muz kublari - 150g",
      "Qaymoq - ixtiyoriy",
    ],
    ingredientsRu: [
      "Холодный кофе - 200мл",
      "Молоко - 100мл",
      "Простой сироп - 30мл",
      "Кубики льда - 150г",
      "Взбитые сливки - по желанию",
    ],
  },

  // Pizza
  {
    id: "16",
    name: "Pepperoni Pizza",
    nameUz: "Pepperoni pizza",
    nameRu: "Пицца Пепперони",
    description: "Classic pizza with pepperoni and mozzarella",
    descriptionUz: "Klassik pizza pepperoni va mozzarella bilan",
    descriptionRu: "Классическая пицца с пепперони и моцареллой",
    price: 68000,
    image: "/pepperoni-pizza.jpg",
    category: "6",
    available: true,
    prepTime: "15-20",
    rating: 4.8,
    ingredients: [
      "Pizza dough - 300g",
      "Tomato sauce - 100ml",
      "Mozzarella cheese - 200g",
      "Pepperoni - 100g",
      "Oregano - 5g",
    ],
    ingredientsUz: [
      "Pizza xamiri - 300g",
      "Pomidor sousi - 100ml",
      "Mozzarella pishloqi - 200g",
      "Pepperoni - 100g",
      "Oregano - 5g",
    ],
    ingredientsRu: [
      "Тесто для пиццы - 300г",
      "Томатный соус - 100мл",
      "Сыр моцарелла - 200г",
      "Пепперони - 100г",
      "Орегано - 5г",
    ],
  },
  {
    id: "17",
    name: "Quattro Formaggi",
    nameUz: "Quattro Formaggi",
    nameRu: "Кватро Формаджи",
    description: "Four cheese pizza with gorgonzola, mozzarella, parmesan, and fontina",
    descriptionUz: "To'rt xil pishloqli pizza gorgonzola, mozzarella, parmesan va fontina bilan",
    descriptionRu: "Пицца с четырьмя сырами: горгонзола, моцарелла, пармезан и фонтина",
    price: 75000,
    image: "/quattro-formaggi-pizza.jpg",
    category: "6",
    available: true,
    prepTime: "15-20",
    rating: 4.7,
    ingredients: ["Pizza dough - 300g", "Mozzarella - 100g", "Gorgonzola - 50g", "Parmesan - 50g", "Fontina - 50g"],
    ingredientsUz: ["Pizza xamiri - 300g", "Mozzarella - 100g", "Gorgonzola - 50g", "Parmesan - 50g", "Fontina - 50g"],
    ingredientsRu: [
      "Тесто для пиццы - 300г",
      "Моцарелла - 100г",
      "Горгонзола - 50г",
      "Пармезан - 50г",
      "Фонтина - 50г",
    ],
  },
  {
    id: "18",
    name: "Vegetarian Pizza",
    nameUz: "Vegetarian pizza",
    nameRu: "Вегетарианская пицца",
    description: "Loaded with fresh vegetables and cheese",
    descriptionUz: "Yangi sabzavotlar va pishloq bilan to'ldirilgan",
    descriptionRu: "Загруженная свежими овощами и сыром",
    price: 62000,
    image: "/vegetarian-pizza.jpg",
    category: "6",
    available: true,
    prepTime: "15-20",
    rating: 4.6,
    ingredients: [
      "Pizza dough - 300g",
      "Tomato sauce - 100ml",
      "Mozzarella - 150g",
      "Bell peppers - 100g",
      "Mushrooms - 100g",
      "Olives - 50g",
    ],
    ingredientsUz: [
      "Pizza xamiri - 300g",
      "Pomidor sousi - 100ml",
      "Mozzarella - 150g",
      "Qalampir - 100g",
      "Qo'ziqorin - 100g",
      "Zaytun - 50g",
    ],
    ingredientsRu: [
      "Тесто для пиццы - 300г",
      "Томатный соус - 100мл",
      "Моцарелла - 150г",
      "Болгарский перец - 100г",
      "Грибы - 100г",
      "Оливки - 50г",
    ],
  },

  // Promotion items
  {
    id: "19",
    name: "Summer Special Combo",
    nameUz: "Yozgi maxsus to'plam",
    nameRu: "Летний специальный комбо",
    description: "Get 20% off on all beverages this summer! Includes any main dish + beverage",
    descriptionUz: "Bu yozda barcha ichimliklardan 20% chegirma! Har qanday asosiy taom + ichimlik",
    descriptionRu: "Получите скидку 20% на все напитки этим летом! Включает любое основное блюдо + напиток",
    price: 85000,
    image: "/restaurant-special-offer-banner.jpg",
    category: "7",
    available: true,
    prepTime: "20-25",
    rating: 4.8,
    ingredients: ["Main dish of choice", "Beverage of choice", "Special summer discount"],
    ingredientsUz: ["Tanlangan asosiy taom", "Tanlangan ichimlik", "Maxsus yozgi chegirma"],
    ingredientsRu: ["Основное блюдо на выбор", "Напиток на выбор", "Специальная летняя скидка"],
  },
  {
    id: "20",
    name: "Family Feast",
    nameUz: "Oilaviy ziyofat",
    nameRu: "Семейный пир",
    description: "Special family meal deal - Save 30%. Perfect for 4 people with appetizers, mains, and desserts",
    descriptionUz:
      "Maxsus oilaviy taom to'plami - 30% tejang. 4 kishi uchun mukammal, ishtaha ochuvchilar, asosiy taomlar va shirinliklar bilan",
    descriptionRu:
      "Специальное семейное предложение - Экономьте 30%. Идеально для 4 человек с закусками, основными блюдами и десертами",
    price: 250000,
    image: "/restaurant-family-combo-meal.jpg",
    category: "7",
    available: true,
    prepTime: "30-40",
    rating: 4.9,
    ingredients: ["2 Appetizers", "4 Main dishes", "2 Desserts", "4 Beverages", "30% discount included"],
    ingredientsUz: [
      "2 ta ishtaha ochuvchi",
      "4 ta asosiy taom",
      "2 ta shirinlik",
      "4 ta ichimlik",
      "30% chegirma kiritilgan",
    ],
    ingredientsRu: ["2 закуски", "4 основных блюда", "2 десерта", "4 напитка", "Включена скидка 30%"],
  },
  {
    id: "21",
    name: "Weekend Special",
    nameUz: "Dam olish kunlari maxsus",
    nameRu: "Специальное предложение выходного дня",
    description: "15% off on all orders during weekends. Valid Saturday and Sunday all day",
    descriptionUz: "Dam olish kunlarida barcha buyurtmalarga 15% chegirma. Shanba va yakshanba kun bo'yi amal qiladi",
    descriptionRu: "Скидка 15% на все заказы в выходные дни. Действует в субботу и воскресенье весь день",
    price: 0,
    image: "/restaurant-discount-promotion.jpg",
    category: "7",
    available: true,
    prepTime: "Varies",
    rating: 4.7,
    ingredients: ["Any menu item", "15% weekend discount", "Valid Sat-Sun"],
    ingredientsUz: ["Har qanday menyu elementi", "15% dam olish kunlari chegirmasi", "Shanba-yakshanba amal qiladi"],
    ingredientsRu: ["Любой пункт меню", "Скидка 15% в выходные", "Действует сб-вс"],
  },
]

export const promotions: Promotion[] = [
  {
    id: "1",
    title: "Summer Special",
    titleUz: "Yozgi maxsus taklif",
    titleRu: "Летнее специальное предложение",
    description: "Get 20% off on all beverages this summer!",
    descriptionUz: "Bu yozda barcha ichimliklardan 20% chegirma oling!",
    descriptionRu: "Получите скидку 20% на все напитки этим летом!",
    image: "/restaurant-special-offer-banner.jpg",
    active: true,
    category: "7",
  },
  {
    id: "2",
    title: "Family Combo",
    titleUz: "Oilaviy to'plam",
    titleRu: "Семейный комбо",
    description: "Special family meal deal - Save 30%",
    descriptionUz: "Maxsus oilaviy taom to'plami - 30% tejang",
    descriptionRu: "Специальное семейное предложение - Экономьте 30%",
    image: "/restaurant-family-combo-meal.jpg",
    active: true,
    category: "7",
  },
  {
    id: "3",
    title: "Weekend Discount",
    titleUz: "Dam olish kunlari chegirmasi",
    titleRu: "Скидка выходного дня",
    description: "15% off on all orders during weekends",
    descriptionUz: "Dam olish kunlarida barcha buyurtmalarga 15% chegirma",
    descriptionRu: "Скидка 15% на все заказы в выходные дни",
    image: "/restaurant-discount-promotion.jpg",
    active: false,
    category: "7",
  },
]

// Local storage helpers
export const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("restaurant-orders")
  return stored ? JSON.parse(stored) : []
}

export const saveOrder = (order: Order) => {
  if (typeof window === "undefined") return
  const orders = getStoredOrders()
  orders.push(order)
  localStorage.setItem("restaurant-orders", JSON.stringify(orders))
}

export const updateOrderStatus = (orderId: string, status: Order["status"]) => {
  if (typeof window === "undefined") return
  const orders = getStoredOrders()
  const orderIndex = orders.findIndex((o) => o.id === orderId)
  if (orderIndex !== -1) {
    orders[orderIndex].status = status
    localStorage.setItem("restaurant-orders", JSON.stringify(orders))
  }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(price)
}
