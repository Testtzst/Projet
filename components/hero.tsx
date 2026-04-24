import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[520px] md:h-[620px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Ingrédients frais sur une table en bois"
        fill
        priority
        className="object-cover"
      />
      {/* Warm overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-block w-10 h-1 bg-primary rounded-full" />
          <span className="font-sans text-sm uppercase tracking-[0.25em] text-primary-foreground/80">
            Recettes du quotidien
          </span>
          <span className="inline-block w-10 h-1 bg-primary rounded-full" />
        </div>

        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-balance drop-shadow-lg">
          Bien manger sans <span className="text-accent">se ruiner</span>
        </h1>

        <p className="font-sans text-lg md:text-xl text-white/85 leading-relaxed mb-8 text-pretty max-w-2xl mx-auto">
          Des recettes goûteuses, généreuses et économiques pour régaler
          toute la famille — sans jamais sacrifier le plaisir.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 md:gap-12 text-white/90">
          <div className="text-center">
            <p className="font-serif text-3xl font-bold text-accent">100+</p>
            <p className="font-sans text-sm mt-1 text-white/70">Recettes</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="font-serif text-3xl font-bold text-accent">{"< 2€"}</p>
            <p className="font-sans text-sm mt-1 text-white/70">Par personne</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="font-serif text-3xl font-bold text-accent">30 min</p>
            <p className="font-sans text-sm mt-1 text-white/70">En moyenne</p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--background))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
