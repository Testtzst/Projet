export interface CategoryVisual {
  classes: string;
  emoji: string;
}

export const categoryVisual: Record<string, CategoryVisual> = {
  "Soupes": {
    classes: "bg-gradient-to-br from-blue-400 to-cyan-500",
    emoji: "🍲",
  },
  "Pâtes & Riz": {
    classes: "bg-gradient-to-br from-amber-400 to-yellow-500",
    emoji: "🍝",
  },
  "Oeufs": {
    classes: "bg-gradient-to-br from-yellow-300 to-amber-400",
    emoji: "🍳",
  },
  "Légumineuses": {
    classes: "bg-gradient-to-br from-green-500 to-emerald-600",
    emoji: "🫘",
  },
  "Gratins": {
    classes: "bg-gradient-to-br from-orange-400 to-amber-600",
    emoji: "🫕",
  },
  "Salades": {
    classes: "bg-gradient-to-br from-lime-400 to-green-500",
    emoji: "🥗",
  },
  "Plats mijotés": {
    classes: "bg-gradient-to-br from-red-400 to-rose-600",
    emoji: "🍖",
  },
  "Tartes & Quiches": {
    classes: "bg-gradient-to-br from-amber-300 to-orange-500",
    emoji: "🥧",
  },
  "Pains & Snacks": {
    classes: "bg-gradient-to-br from-stone-300 to-amber-400",
    emoji: "🥖",
  },
  "Desserts": {
    classes: "bg-gradient-to-br from-pink-400 to-purple-500",
    emoji: "🍰",
  },
};

export const defaultVisual: CategoryVisual = {
  classes: "bg-gradient-to-br from-gray-300 to-gray-500",
  emoji: "🍽️",
};

export function getVisual(category: string): CategoryVisual {
  return categoryVisual[category] ?? defaultVisual;
}
