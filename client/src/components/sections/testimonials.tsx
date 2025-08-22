import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: "Absolument divin ! Le tiramisu classique m'a transporté directement en Italie. On peut goûter l'amour et la qualité dans chaque bouchée.",
      author: "Maria Rodriguez",
      role: "Cliente Fidèle",
      initial: "M",
    },
    {
      rating: 5,
      text: "Parfait pour notre célébration d'anniversaire ! La présentation était magnifique et le goût encore meilleur. Je recommande vivement !",
      author: "Alessandro Thompson",
      role: "Occasions Spéciales",
      initial: "A",
    },
    {
      rating: 5,
      text: "Le tiramisu à la pistache est extraordinaire ! En tant qu'Italien moi-même, je peux confirmer que c'est du vrai. Bravissimo !",
      author: "Sofia Chen",
      role: "Passionnée de Cuisine",
      initial: "S",
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-xl text-espresso/70 max-w-2xl mx-auto">
            Chaque avis raconte une histoire de satisfaction et de joie
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-warmWhite shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-espresso/80 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-espresso">{testimonial.initial}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-espresso">{testimonial.author}</h4>
                    <p className="text-sm text-espresso/60">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
