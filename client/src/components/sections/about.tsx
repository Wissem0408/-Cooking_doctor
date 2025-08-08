import { Heart } from "lucide-react";

export default function About() {
  return (
    <section className="py-20 bg-warmWhite">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
              L'Histoire Derrière Chaque Bouchée
            </h2>
            <p className="text-lg mb-6 leading-relaxed text-espresso/80">
              Bienvenue dans un monde où la tradition rencontre la passion. En tant que Cooking Doctor, j'ai dédié ma vie à perfectionner l'art du tiramisu, apportant des saveurs italiennes authentiques à votre table avec une touche moderne.
            </p>
            <p className="text-lg mb-8 leading-relaxed text-espresso/80">
              Chaque tiramisu est fabriqué à la main en utilisant uniquement les meilleurs ingrédients : mascarpone authentique, espresso fraîchement préparé, et délicats boudoirs. Aucun conservateur, aucun raccourci – juste une excellence artisanale pure.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                <Heart className="text-espresso text-xl" />
              </div>
              <div>
                <h3 className="font-playfair text-xl font-semibold">Fait avec Amour</h3>
                <p className="text-espresso/70">Chaque création raconte une histoire</p>
              </div>
            </div>
          </div>
          <div className="order-first md:order-last">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="La Cooking Doctor dans sa cuisine" 
              className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
