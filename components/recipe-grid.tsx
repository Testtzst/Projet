"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ShoppingCart, Heart, Search, SlidersHorizontal, X, Leaf, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { recipes, categories } from "@/lib/recipes";
import type { Category, Recipe } from "@/lib/recipes";
import RecipeCard from "./recipe-card";
import RecipeModal from "./recipe-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ALL = "Toutes";

// Fuse.js configuration for fuzzy search
const fuse = new Fuse(recipes, {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.2 },
    { name: "tags", weight: 0.2 },
    { name: "ingredients", weight: 0.2 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
});

// ---------- Shopping Cart Drawer ----------
function CartDrawer({
  cart,
  onRemove,
  onClose,
}: {
  cart: Recipe[];
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const total = cart.reduce((s, r) => s + r.costPerPerson * r.servings, 0);

  const copyList = async () => {
    if (!cart.length) return;
    const lines = cart
      .flatMap((r) => [`${r.title} (${r.servings} pers.)`, ...r.ingredients.map((i) => `  - ${i}`)])
      .join("\n");
    const text = `Liste de courses\n\n${lines}\n\nTotal estime: ${total.toFixed(2)} euros`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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
      <motion.div
        key="cart-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        key="cart-panel"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-card shadow-2xl flex flex-col"
        aria-label="Panier de courses"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Liste de courses
            {cart.length > 0 && (
              <Badge className="ml-1 text-xs">{cart.length}</Badge>
            )}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-serif text-base">Votre liste est vide</p>
              <p className="text-sm mt-1">Ajoutez des recettes depuis le catalogue</p>
            </div>
          ) : (
            cart.map((recipe) => (
              <div key={recipe.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{recipe.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {recipe.servings} pers. • {recipe.ingredients.length} ingr.
                  </p>
                </div>
                <div className="text-xs font-bold text-primary whitespace-nowrap">
                  ~{(recipe.costPerPerson * recipe.servings).toFixed(2)}€
                </div>
                <button
                  onClick={() => onRemove(recipe.id)}
                  className="w-6 h-6 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                  aria-label={`Retirer ${recipe.title}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total estimé</span>
              <span className="text-primary">{total.toFixed(2)} €</span>
            </div>
            <Button className="w-full gap-2" onClick={copyList}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Liste copiee !" : "Copier la liste"}
            </Button>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

// ---------- Favourites Strip ----------
function FavouritesStrip({
  favIds,
  onOpen,
}: {
  favIds: Set<string>;
  onOpen: (r: Recipe) => void;
}) {
  const favRecipes = recipes.filter((r) => favIds.has(r.id));
  if (!favRecipes.length) return null;
  return (
    <div className="mb-6">
      <h3 className="font-serif text-base font-bold text-foreground mb-2 flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500 fill-current" />
        Mes favoris
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {favRecipes.map((r) => (
          <button
            key={r.id}
            onClick={() => onOpen(r)}
            className="flex-shrink-0 flex flex-col items-center gap-1 text-center group"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] text-muted-foreground max-w-[56px] leading-tight line-clamp-2">{r.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Main Grid ----------
export default function RecipeGrid() {
  const [activeCategory, setActiveCategory] = useState<Category | typeof ALL>(ALL);
  const [search, setSearch] = useState("");
  const [maxCost, setMaxCost] = useState(5);
  const [veganOnly, setVeganOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "cost" | "time" | "rating">("default");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Recipe[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recipe-favorites");
    if (stored) {
      try {
        setFavIds(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (favIds.size > 0) {
      localStorage.setItem("recipe-favorites", JSON.stringify([...favIds]));
    } else {
      localStorage.removeItem("recipe-favorites");
    }
  }, [favIds]);

  const toggleFav = useCallback((id: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const addToCart = useCallback((recipe: Recipe) => {
    setCart((prev) =>
      prev.some((r) => r.id === recipe.id) ? prev.filter((r) => r.id !== recipe.id) : [...prev, recipe]
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim();
    
    // Use fuse.js for fuzzy search when there's a query
    let baseList: Recipe[];
    if (q) {
      const results = fuse.search(q);
      baseList = results.map((r) => r.item);
    } else {
      baseList = recipes;
    }

    // Apply other filters
    let list = baseList.filter((r) => {
      const matchCat = activeCategory === ALL || r.category === activeCategory;
      const matchCost = r.costPerPerson <= maxCost;
      const matchVegan = !veganOnly || r.isVegan;
      return matchCat && matchCost && matchVegan;
    });

    // Apply sorting
    if (sortBy === "cost") list = [...list].sort((a, b) => a.costPerPerson - b.costPerPerson);
    if (sortBy === "time") list = [...list].sort((a, b) => a.cookTime - b.cookTime);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, search, maxCost, veganOnly, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12" id="recettes">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="font-sans text-sm uppercase tracking-widest text-primary mb-2">Le carnet de recettes</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-balance">
          Des plats qui font du bien
        </h2>
        <p className="font-sans text-muted-foreground mt-2 max-w-md mx-auto text-pretty">
          Filtrez par catégorie, cherchez une envie, et découvrez votre prochaine recette préférée.
        </p>
      </div>

      {/* Favourites strip */}
      <FavouritesStrip favIds={favIds} onOpen={setOpenRecipe} />

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
          {[ALL, ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category | typeof ALL)}
              className={cn(
                "font-sans text-sm px-4 py-1.5 rounded-full border transition-all duration-200",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
              )}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Recette, ingrédient…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-card text-card-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
            aria-label="Rechercher une recette"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-secondary rounded-xl px-4 py-3">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />

        {/* Budget slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <label htmlFor="cost-slider" className="font-sans text-sm text-secondary-foreground whitespace-nowrap">
            Budget max :
          </label>
          <input
            id="cost-slider"
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={maxCost}
            onChange={(e) => setMaxCost(parseFloat(e.target.value))}
            className="flex-1 accent-primary h-1.5 cursor-pointer"
            aria-label="Budget maximum par personne"
          />
          <span className="font-serif font-bold text-primary text-base w-14 text-right" aria-live="polite">
            {maxCost.toFixed(2)}€
          </span>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="font-sans text-sm border border-border bg-card rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Trier les recettes"
        >
          <option value="default">Trier par défaut</option>
          <option value="cost">Prix croissant</option>
          <option value="time">Durée croissante</option>
          <option value="rating">Meilleures notes</option>
        </select>

        {/* Vegan toggle */}
        <button
          onClick={() => setVeganOnly((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all",
            veganOnly
              ? "bg-green-600 text-white border-green-600"
              : "border-border text-muted-foreground hover:border-green-600 hover:text-green-600"
          )}
          aria-pressed={veganOnly}
        >
          <Leaf className="w-3.5 h-3.5" />Végan seulement
        </button>

        {/* Reset */}
        {(activeCategory !== ALL || search || maxCost < 5 || veganOnly || sortBy !== "default") && (
          <button
            onClick={() => {
              setActiveCategory(ALL);
              setSearch("");
              setMaxCost(5);
              setVeganOnly(false);
              setSortBy("default");
            }}
            className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 ml-auto"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-sans text-sm text-muted-foreground" aria-live="polite">
          {filtered.length === 0
            ? "Aucune recette trouvée."
            : `${filtered.length} recette${filtered.length > 1 ? "s" : ""} trouvée${filtered.length > 1 ? "s" : ""}`}
        </p>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 font-sans text-sm px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={`Liste de courses, ${cart.length} recettes`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Liste de courses</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              isFav={favIds.has(recipe.id)}
              onFavToggle={toggleFav}
              onOpen={setOpenRecipe}
              onAddToCart={addToCart}
              inCart={cart.some((r) => r.id === recipe.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-muted-foreground mb-2">Aucune recette trouvée</p>
          <p className="font-sans text-sm text-muted-foreground">
            Essayez d&apos;ajuster vos filtres ou augmentez le budget.
          </p>
          <button
            onClick={() => { setActiveCategory(ALL); setSearch(""); setMaxCost(5); setVeganOnly(false); setSortBy("default"); }}
            className="mt-4 font-sans text-sm text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Recipe Modal */}
      <RecipeModal
        recipe={openRecipe}
        onClose={() => setOpenRecipe(null)}
        isFav={openRecipe ? favIds.has(openRecipe.id) : false}
        onFavToggle={toggleFav}
        inCart={openRecipe ? cart.some((r) => r.id === openRecipe.id) : false}
        onAddToCart={addToCart}
      />

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />
      )}
    </section>
  );
}
