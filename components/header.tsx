"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Heart, ShoppingCart, Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favCount: number;
  cartCount: number;
  onFavClick: () => void;
  onCartClick: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  filters: { budget1: boolean; time30: boolean; vegan: boolean };
  onFilterChange: (key: "budget1" | "time30" | "vegan", val: boolean) => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  favCount,
  cartCount,
  onFavClick,
  onCartClick,
  darkMode,
  onDarkModeToggle,
  filters,
  onFilterChange,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-background border-b border-border"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-serif font-bold text-lg leading-none">
                BF
              </span>
            </div>
            <span className="hidden sm:block font-serif font-bold text-xl text-foreground">
              La Bonne Fourchette
            </span>
          </a>

          {/* Search bar — desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une recette, un ingrédient..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-secondary/60 border-border focus:bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Quick Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative gap-1.5">
                  <span className="hidden sm:inline text-sm">Filtres</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Filtres rapides</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.budget1}
                  onCheckedChange={(v) => onFilterChange("budget1", v)}
                >
                  Budget &lt; 1€/personne
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.time30}
                  onCheckedChange={(v) => onFilterChange("time30", v)}
                >
                  Moins de 30 min
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.vegan}
                  onCheckedChange={(v) => onFilterChange("vegan", v)}
                >
                  Végan uniquement
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onFavClick}
              aria-label={`Favoris (${favCount})`}
            >
              <Heart className={cn("w-5 h-5", favCount > 0 ? "fill-red-500 text-red-500" : "")} />
              {favCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
                  {favCount}
                </Badge>
              )}
            </Button>

            {/* Shopping list */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
              aria-label={`Liste de courses (${cartCount})`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Dark mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDarkModeToggle}
              aria-label="Basculer le mode sombre"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu mobile"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une recette..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-secondary/60"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
