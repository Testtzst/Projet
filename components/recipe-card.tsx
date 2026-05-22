"use client";

import { Heart, Clock, Users, Star, Leaf, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getVisual } from "@/lib/category-visuals";
import type { Recipe } from "@/lib/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  isFav: boolean;
  onFavToggle: (id: string) => void;
  onOpen: (recipe: Recipe) => void;
  onAddToCart: (recipe: Recipe) => void;
  inCart: boolean;
  index?: number;
}

export default function RecipeCard({
  recipe,
  isFav,
  onFavToggle,
  onOpen,
  onAddToCart,
  inCart,
  index = 0,
}: RecipeCardProps) {
  const visual = getVisual(recipe.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.28), ease: "easeOut" }}
      className="group bg-card rounded-xl overflow-hidden shadow-sm border border-border
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onOpen(recipe)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(recipe)}
      aria-label={`Ouvrir la recette ${recipe.title}`}
    >
      {/* Visual */}
      <div className={cn("relative overflow-hidden aspect-[4/3]", visual.classes)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-7xl select-none transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
            role="img"
            aria-hidden="true"
          >
            {visual.emoji}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          {recipe.featured && (
            <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold shadow-sm">
              Coup de coeur
            </Badge>
          )}
          {recipe.isVegan && (
            <Badge className="bg-green-600 text-white text-[10px] shadow-sm">
              <Leaf className="w-2.5 h-2.5 mr-0.5" />Végan
            </Badge>
          )}
        </div>

        {/* Cost badge top-right */}
        <div className={cn(
          "absolute top-2 right-10 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm",
          recipe.costPerPerson <= 1
            ? "bg-green-100 text-green-800"
            : "bg-amber-100 text-amber-800"
        )}>
          {recipe.costPerPerson.toFixed(2)}€/pers.
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavToggle(recipe.id); }}
          className={cn(
            "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center",
            "bg-white/90 shadow backdrop-blur-sm transition-all duration-200 hover:scale-110",
            isFav ? "text-red-500" : "text-muted-foreground"
          )}
          aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={cn("w-3.5 h-3.5", isFav ? "fill-current" : "")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          {recipe.category}
        </span>
        <h3 className="font-serif font-bold text-base leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {recipe.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-border/60">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />{recipe.cookTime} min
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />{recipe.servings}
          </div>
          <div className="flex items-center gap-0.5 ml-auto">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold">{recipe.rating}</span>
          </div>
        </div>

        {/* Cart button */}
        <Button
          size="sm"
          variant={inCart ? "secondary" : "outline"}
          className="w-full text-xs gap-1.5 h-7 mt-1"
          onClick={(e) => { e.stopPropagation(); onAddToCart(recipe); }}
        >
          <ShoppingCart className="w-3 h-3" />
          {inCart ? "Dans la liste" : "Ajouter à la liste"}
        </Button>
      </div>
    </motion.article>
  );
}
