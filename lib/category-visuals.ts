export interface CategoryVisual {
  image: string;
  placeholder: string;
  emoji: string;
}

export const categoryVisual: Record<string, CategoryVisual> = {
  "Soupes": {
    image: "/images/categories/soupes.jpg",
    placeholder: "bg-gradient-to-br from-blue-400 to-cyan-500",
    emoji: "🍲",
  },
  "Pâtes & Riz": {
    image: "/images/categories/pates-riz.jpg",
    placeholder: "bg-gradient-to-br from-amber-400 to-yellow-500",
    emoji: "🍝",
  },
  "Oeufs": {
    image: "/images/categories/oeufs.jpg",
    placeholder: "bg-gradient-to-br from-yellow-300 to-amber-400",
    emoji: "🍳",
  },
  "Légumineuses": {
    image: "/images/categories/legumineuses.jpg",
    placeholder: "bg-gradient-to-br from-green-500 to-emerald-600",
    emoji: "🫘",
  },
  "Gratins": {
    image: "/images/categories/gratins.jpg",
    placeholder: "bg-gradient-to-br from-orange-400 to-amber-600",
    emoji: "🫕",
  },
  "Salades": {
    image: "/images/categories/salades.jpg",
    placeholder: "bg-gradient-to-br from-lime-400 to-green-500",
    emoji: "🥗",
  },
  "Plats mijotés": {
    image: "/images/categories/plats-mijotes.jpg",
    placeholder: "bg-gradient-to-br from-red-400 to-rose-600",
    emoji: "🍖",
  },
  "Tartes & Quiches": {
    image: "/images/categories/tartes-quiches.jpg",
    placeholder: "bg-gradient-to-br from-amber-300 to-orange-500",
    emoji: "🥧",
  },
  "Pains & Snacks": {
    image: "/images/categories/pains-snacks.jpg",
    placeholder: "bg-gradient-to-br from-stone-300 to-amber-400",
    emoji: "🥖",
  },
  "Desserts": {
    image: "/images/categories/desserts.jpg",
    placeholder: "bg-gradient-to-br from-pink-400 to-purple-500",
    emoji: "🍰",
  },
};

export const defaultVisual: CategoryVisual = {
  image: "",
  placeholder: "bg-gradient-to-br from-gray-300 to-gray-500",
  emoji: "🍽️",
};

export function getVisual(category: string): CategoryVisual {
  return categoryVisual[category] ?? defaultVisual;
}
