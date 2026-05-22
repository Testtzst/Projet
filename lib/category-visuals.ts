export interface CategoryVisual {
  placeholder: string;
  emoji: string;
}

export const categoryVisual: Record<string, CategoryVisual> = {
  "Bœuf": {
    placeholder: "bg-gradient-to-br from-red-700 to-red-900",
    emoji: "🥩",
  },
  "Volaille": {
    placeholder: "bg-gradient-to-br from-amber-400 to-orange-500",
    emoji: "🍗",
  },
  "Agneau": {
    placeholder: "bg-gradient-to-br from-rose-400 to-red-600",
    emoji: "🍖",
  },
  "Porc": {
    placeholder: "bg-gradient-to-br from-pink-400 to-rose-500",
    emoji: "🥓",
  },
  "Fruits de mer": {
    placeholder: "bg-gradient-to-br from-blue-400 to-cyan-600",
    emoji: "🦞",
  },
  "Pâtes & Riz": {
    placeholder: "bg-gradient-to-br from-amber-300 to-yellow-500",
    emoji: "🍝",
  },
  "Végétarien": {
    placeholder: "bg-gradient-to-br from-green-400 to-emerald-600",
    emoji: "🥗",
  },
  "Végane": {
    placeholder: "bg-gradient-to-br from-lime-400 to-green-600",
    emoji: "🥦",
  },
  "Desserts": {
    placeholder: "bg-gradient-to-br from-pink-400 to-purple-500",
    emoji: "🍰",
  },
  "Petit-déjeuner": {
    placeholder: "bg-gradient-to-br from-yellow-300 to-amber-400",
    emoji: "🍳",
  },
  "Entrées": {
    placeholder: "bg-gradient-to-br from-teal-400 to-cyan-500",
    emoji: "🥙",
  },
  "Accompagnements": {
    placeholder: "bg-gradient-to-br from-lime-300 to-green-400",
    emoji: "🥔",
  },
  "Divers": {
    placeholder: "bg-gradient-to-br from-slate-400 to-gray-600",
    emoji: "🍽️",
  },
};

export const defaultVisual: CategoryVisual = {
  placeholder: "bg-gradient-to-br from-gray-300 to-gray-500",
  emoji: "🍽️",
};

export function getVisual(category: string): CategoryVisual {
  return categoryVisual[category] ?? defaultVisual;
}
