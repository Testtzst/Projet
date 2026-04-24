import Hero from "@/components/hero";
import RecipeGrid from "@/components/recipe-grid";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-serif font-bold text-xl text-foreground tracking-tight">
            La Bonne Fourchette
          </a>
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
            <a
              href="#recettes"
              className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Recettes
            </a>
            <a
              href="#recettes"
              className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Conseils budget
            </a>
            <a
              href="#recettes"
              className="font-sans text-sm px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Toutes les recettes
            </a>
          </nav>

          {/* Mobile nav toggle placeholder */}
          <a
            href="#recettes"
            className="md:hidden font-sans text-sm px-4 py-1.5 rounded-full bg-primary text-primary-foreground"
          >
            Recettes
          </a>
        </div>
      </header>

      {/* Offset for fixed header */}
      <div className="h-14" aria-hidden="true" />

      <Hero />

      {/* Tips banner */}
      <div
        className="py-4 text-center font-sans text-sm text-accent-foreground"
        style={{ background: "var(--accent)" }}
      >
        Toutes les recettes sont concues pour moins de 2€ par personne — sans sacrifier le gout.
      </div>

      <RecipeGrid />

      <Footer />
    </main>
  );
}
