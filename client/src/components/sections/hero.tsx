import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg">
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
          Élégant Tiramisu Fait Maison
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed animate-fade-in">
          Préparé avec amour par la Cooking Doctor
        </p>
        <Link href="/order">
          <Button 
            size="lg"
            className="bg-gold text-espresso px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg animate-scale-in"
          >
            Commander Maintenant
          </Button>
        </Link>
      </div>
    </section>
  );
}
