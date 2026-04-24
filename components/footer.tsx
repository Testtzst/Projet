"use client";

import { useState } from "react";
import { Mail, Send, MapPin, Phone, ChefHat, Heart, Leaf, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSent(true);
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setContactSent(false), 3000);
    }
  };

  return (
    <footer className="bg-secondary border-t border-border mt-12">
      {/* Newsletter section */}
      <div className="bg-primary/10 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
            Recevez nos meilleures recettes
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Inscrivez-vous a notre newsletter et recevez chaque semaine des recettes economiques et delicieuses.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full border border-border bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" className="rounded-full gap-2">
              {subscribed ? "Merci !" : "S'inscrire"}
              <Send className="w-4 h-4" />
            </Button>
          </form>
          {subscribed && (
            <p className="text-sm text-green-600 mt-3">Vous etes inscrit ! Merci de votre confiance.</p>
          )}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="font-serif text-xl font-bold text-foreground">La Bonne Fourchette</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Des recettes gouteuses, generreuses et economiques pour regaler toute la famille sans jamais sacrifier le plaisir.
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="w-3.5 h-3.5 text-red-500" />100+ recettes
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Leaf className="w-3.5 h-3.5 text-green-500" />Options vegan
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              {["Toutes les recettes", "Soupes", "Plats mijotes", "Desserts", "Conseils budget"].map((link) => (
                <li key={link}>
                  <a href="#recettes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-4">Pourquoi nous choisir</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Recettes rapides, moins de 30 minutes en moyenne</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-bold">€</span>
                <span>Budget maitrise, moins de 2 euros par personne</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Astuces anti-gaspi pour chaque recette</span>
              </li>
            </ul>
          </div>

          {/* Contact form */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-4">Contactez-nous</h4>
            <form onSubmit={handleContact} className="space-y-3">
              <input
                type="text"
                placeholder="Votre nom"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="email"
                placeholder="Votre email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <textarea
                placeholder="Votre message..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
              <Button type="submit" size="sm" className="w-full">
                {contactSent ? "Message envoye !" : "Envoyer"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} La Bonne Fourchette — Fait avec passion et un budget serre.
          </p>
          <p className="text-xs text-muted-foreground">
            Bien manger ne devrait jamais couter cher.
          </p>
        </div>
      </div>
    </footer>
  );
}
