"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Clock, Users, Star, Leaf, Heart, ShoppingCart, X,
  CheckCircle2, Lightbulb, Flame, Copy, Check
} from "lucide-react";
import { getVisual } from "@/lib/category-visuals";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/lib/recipes";

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isFav: boolean;
  onFavToggle: (id: string) => void;
  inCart: boolean;
  onAddToCart: (recipe: Recipe) => void;
}

export default function RecipeModal({
  recipe,
  onClose,
  isFav,
  onFavToggle,
  inCart,
  onAddToCart,
}: RecipeModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    if (recipe) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [recipe, handleKeyDown]);

  useEffect(() => {
    setCopied(false);
  }, [recipe?.id]);

  const [copied, setCopied] = useState(false);

  const copyRecipe = async () => {
    if (!recipe) return;
    const text = `${recipe.title}\n\nIngredients:\n${recipe.ingredients.map(i => `- ${i}`).join("\n")}\n\nPreparation:\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {recipe && (
        <>
          {/* JSON-LD SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Recipe",
                name: recipe.title,
                description: recipe.description,
                recipeCategory: recipe.category,
                cookTime: `PT${recipe.cookTime}M`,
                recipeYield: `${recipe.servings} portions`,
                nutrition: recipe.calories
                  ? { "@type": "NutritionInformation", calories: `${recipe.calories} cal` }
                  : undefined,
                recipeIngredient: recipe.ingredients,
                recipeInstructions: recipe.steps.map((s, i) => ({
                  "@type": "HowToStep", position: i + 1, text: s,
                })),
              }),
            }}
          />

          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={recipe.title}
          >
            <div className="bg-card w-full sm:max-w-3xl max-h-[95dvh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl">

              {/* Hero image */}
              {(() => {
                const visual = getVisual(recipe.category);
                return (
                  <div className={cn("relative h-48 sm:h-64 shrink-0", visual.placeholder)}>
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 768px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <button
                      onClick={onClose}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                      aria-label="Fermer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-primary/80 px-2 py-0.5 rounded-full">
                        {recipe.category}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">
                        {recipe.title}
                      </h2>
                    </div>
                  </div>
                );
              })()}

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">

                {/* Meta row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={cn(
                    "text-sm font-bold px-3 py-1 rounded-full",
                    recipe.costPerPerson <= 1
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  )}>
                    {recipe.costPerPerson.toFixed(2)}€ / personne
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />{recipe.cookTime} min
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />{recipe.servings} portions
                  </div>
                  {recipe.calories && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Flame className="w-4 h-4" />{recipe.calories} kcal
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold">{recipe.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                  {recipe.isVegan && (
                    <Badge className="text-xs bg-green-600 text-white">
                      <Leaf className="w-2.5 h-2.5 mr-1" />Végan
                    </Badge>
                  )}
                  {recipe.isVegetarian && !recipe.isVegan && (
                    <Badge className="text-xs bg-lime-600 text-white">Végétarien</Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{recipe.description}</p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Ingredients */}
                  <section>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-primary inline-block" aria-hidden="true" />
                      Ingrédients
                    </h3>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Steps */}
                  <section>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-primary inline-block" aria-hidden="true" />
                      Préparation
                    </h3>
                    <ol className="space-y-3">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>

                {/* Anti-waste tip */}
                {recipe.antiWasteTip && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      Astuce anti-gaspi
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                      {recipe.antiWasteTip}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="flex items-center gap-2 p-4 border-t border-border bg-card shrink-0">
                <Button
                  variant={isFav ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFavToggle(recipe.id)}
                  className="gap-1.5"
                >
                  <Heart className={cn("w-4 h-4", isFav ? "fill-current" : "")} />
                  {isFav ? "Favori" : "Ajouter aux favoris"}
                </Button>
                <Button
                  variant={inCart ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => onAddToCart(recipe)}
                  className="gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? "Dans la liste" : "Liste de courses"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyRecipe}
                  className="gap-1.5 ml-auto"
                  aria-label="Copier la recette"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? "Copie !" : "Copier"}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
